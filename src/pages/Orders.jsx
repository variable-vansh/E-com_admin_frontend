import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Search,
  FilterList,
  CalendarToday,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import api from "../services/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const getStatusColor = (status) => {
  const colors = {
    PENDING: "warning",
    CONFIRMED: "info",
    PROCESSING: "primary",
    SHIPPED: "secondary",
    DELIVERED: "success",
    CANCELLED: "error",
    REFUNDED: "default",
  };
  return colors[status] || "default";
};

const StatusChip = ({ status }) => (
  <Chip
    label={status}
    color={getStatusColor(status)}
    size="small"
    variant="filled"
  />
);

const OrderDetailsModal = ({ open, onClose, order, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (newStatus !== order.status) {
      try {
        await api.patch(`/orders/${order.id}/status`, { status: newStatus });
        toast.success("Order status updated successfully");
        onStatusUpdate();
        onClose();
      } catch (error) {
        toast.error("Failed to update order status");
      }
    }
  };

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" mb={3}>
          Order Details - #{order.orderNumber || order.id}
        </Typography>

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography>
                  <strong>Name:</strong> {order.customerName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {order.customerEmail}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {order.customerPhone || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <Typography>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Total Amount:</strong> $
                  {order.totalAmount?.toFixed(2)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    <strong>Current Status:</strong>
                  </Typography>
                  <StatusChip status={order.status} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Shipping Address */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {order.shippingAddress?.street || "N/A"}
                </Typography>
                <Typography>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode}
                </Typography>
                <Typography>
                  {order.shippingAddress?.country || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List>
                  {order.items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            item.productName || `Product ID: ${item.productId}`
                          }
                          secondary={`Quantity: ${
                            item.quantity
                          } × $${item.price?.toFixed(2)} = $${(
                            item.quantity * item.price
                          )?.toFixed(2)}`}
                        />
                      </ListItem>
                      {index < order.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" align="right">
                  Total: ${order.totalAmount?.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Update */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Update Order Status
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      label="Status"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleStatusUpdate}
                    disabled={newStatus === order.status}
                  >
                    Update Status
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toString().includes(searchQuery) ||
      order.id?.toString().includes(searchQuery);

    const matchesStatus = !statusFilter || order.status === statusFilter;

    const orderDate = new Date(order.orderDate);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/orders/${orderId}`);
        toast.success("Order deleted successfully");
        fetchOrders();
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  if (loading) {
    return <Typography>Loading orders...</Typography>;
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Orders Management</Typography>
        <Typography variant="h6" color="text.secondary">
          {filteredOrders.length} orders
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
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

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setDateFrom("");
                setDateTo("");
              }}
              startIcon={<FilterList />}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quick Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.orderNumber || order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.customerEmail}</TableCell>
              <TableCell align="right">
                ${order.totalAmount?.toFixed(2)}
              </TableCell>
              <TableCell>
                <StatusChip status={order.status} />
              </TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleQuickStatusUpdate(order.id, e.target.value)
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="View Details">
                  <IconButton
                    onClick={() => handleViewDetails(order)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Order">
                  <IconButton
                    onClick={() => handleDelete(order.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredOrders.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || statusFilter || dateFrom || dateTo
              ? "Try adjusting your filters"
              : "No orders have been placed yet"}
          </Typography>
        </Box>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
        order={selectedOrder}
        onStatusUpdate={fetchOrders}
      />
    </Box>
  );
};

export default Orders;
