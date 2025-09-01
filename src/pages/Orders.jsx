import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, FilterList, Refresh } from "@mui/icons-material";
import { ordersService } from "../services/ordersService";
import useOrdersCrud from "../hooks/useOrdersCrud";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import OrderTable from "../components/orders/OrderTable";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const Orders = () => {
  const {
    data: orders,
    loading,
    updateStatus,
    deleteItem,
    searchItems,
    setStatusFilter,
    setDateRange,
    clearFilters,
    searchQuery,
    statusFilter,
    dateFrom,
    dateTo,
    fetchData,
  } = useOrdersCrud(ordersService);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minItems, setMinItems] = useState("");
  const [maxItems, setMaxItems] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateStatus(orderId, newStatus);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    await deleteItem(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  const handleClearFilters = () => {
    clearFilters();
    setMinAmount("");
    setMaxAmount("");
    setMinItems("");
    setMaxItems("");
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <Box>
      <PageHeader
        title="Orders"
        actionButton={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh orders">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                color="primary"
                sx={{
                  bgcolor: "primary.lighter",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <SearchBar
              value={searchQuery}
              onChange={searchItems}
              placeholder="Search by customer name, phone, 6-digit order ID..."
              sx={{ width: 350 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Hide Filters" : "More Filters"}
            </Button>
          </Box>
        }
      />

      {/* Advanced Filters - Only show when button is clicked */}
      {showAdvancedFilters && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
              Filter Orders
            </Typography>
            <Button
              variant="text"
              onClick={handleClearFilters}
              startIcon={<FilterList />}
              size="small"
              color="error"
            >
              Clear All Filters
            </Button>
          </Box>

          {/* Basic Filters Row */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, color: "text.secondary" }}
            >
              Basic Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Order Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {ORDER_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateRange(e.target.value, dateTo)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateRange(dateFrom, e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Advanced Filters Row */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, color: "text.secondary" }}
            >
              Advanced Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Order Value"
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Order Value"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Items Count"
                  type="number"
                  value={minItems}
                  onChange={(e) => setMinItems(e.target.value)}
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Items Count"
                  type="number"
                  value={maxItems}
                  onChange={(e) => setMaxItems(e.target.value)}
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <OrderTable
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        loading={loading}
      />

      <OrderDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message="Are you sure you want to delete this order?"
      />
    </Box>
  );
};

export default Orders;
