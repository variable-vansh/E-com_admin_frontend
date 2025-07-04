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
  Badge,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  Add,
  Remove,
  Warning,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import api from "../services/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const getStockStatus = (currentStock, reservedStock, lowStockAlert) => {
  const availableStock = currentStock - reservedStock;
  if (availableStock <= 0) return { status: "Out of Stock", color: "error" };
  if (availableStock <= lowStockAlert)
    return { status: "Low Stock", color: "warning" };
  return { status: "In Stock", color: "success" };
};

const StockStatusChip = ({ currentStock, reservedStock, lowStockAlert }) => {
  const { status, color } = getStockStatus(
    currentStock,
    reservedStock,
    lowStockAlert
  );
  return <Chip label={status} color={color} size="small" />;
};

const InventoryForm = ({ open, onClose, inventory, refreshInventory }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    reservedQuantity: "0",
    lowStockAlert: "10",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (inventory) {
        setFormData({
          productId: inventory.productId || "",
          quantity: inventory.quantity?.toString() || "",
          reservedQuantity: inventory.reservedQuantity?.toString() || "0",
          lowStockAlert: inventory.lowStockAlert?.toString() || "10",
        });
      } else {
        setFormData({
          productId: "",
          quantity: "",
          reservedQuantity: "0",
          lowStockAlert: "10",
        });
      }
    }
  }, [open, inventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inventoryData = {
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      reservedQuantity: parseInt(formData.reservedQuantity),
      lowStockAlert: parseInt(formData.lowStockAlert),
    };

    try {
      if (inventory) {
        await api.put(`/inventory/${inventory.productId}`, inventoryData);
        toast.success("Inventory updated successfully");
      } else {
        await api.post("/inventory", inventoryData);
        toast.success("Inventory created successfully");
      }
      refreshInventory();
      onClose();
    } catch (error) {
      toast.error("Failed to save inventory.");
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {inventory ? "Edit" : "Add"} Inventory
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Product</InputLabel>
            <Select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              label="Product"
              disabled={!!inventory} // Disable product selection when editing
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Current Stock"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Reserved Quantity"
            name="reservedQuantity"
            type="number"
            value={formData.reservedQuantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            helperText="Stock reserved for pending orders"
          />

          <TextField
            label="Low Stock Alert Threshold"
            name="lowStockAlert"
            type="number"
            value={formData.lowStockAlert}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            helperText="Alert when available stock falls below this number"
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              {inventory ? "Update" : "Create"} Inventory
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const QuickStockAdjustment = ({ inventory, onAdjust }) => {
  const [adjustmentValue, setAdjustmentValue] = useState(1);

  const handleAdjustment = (type) => {
    const newQuantity =
      type === "add"
        ? inventory.quantity + adjustmentValue
        : Math.max(0, inventory.quantity - adjustmentValue);

    onAdjust(inventory.productId, newQuantity);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        size="small"
        type="number"
        value={adjustmentValue}
        onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 1)}
        sx={{ width: 80 }}
        inputProps={{ min: 1 }}
      />
      <Tooltip title={`Remove ${adjustmentValue}`}>
        <IconButton
          size="small"
          onClick={() => handleAdjustment("subtract")}
          color="error"
        >
          <Remove />
        </IconButton>
      </Tooltip>
      <Tooltip title={`Add ${adjustmentValue}`}>
        <IconButton
          size="small"
          onClick={() => handleAdjustment("add")}
          color="success"
        >
          <Add />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentInventory, setCurrentInventory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get("/inventory");
      setInventory(response.data);
    } catch (error) {
      toast.error("Failed to fetch inventory.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `Product ID: ${productId}`;
  };

  const filteredInventory = inventory.filter((item) => {
    const productName = getProductName(item.productId).toLowerCase();
    return productName.includes(searchQuery.toLowerCase());
  });

  const handleOpen = (inventoryItem = null) => {
    setCurrentInventory(inventoryItem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentInventory(null);
  };

  const handleDelete = async (productId) => {
    if (
      window.confirm("Are you sure you want to delete this inventory record?")
    ) {
      try {
        await api.delete(`/inventory/${productId}`);
        toast.success("Inventory deleted successfully");
        fetchInventory();
      } catch (error) {
        toast.error("Failed to delete inventory.");
      }
    }
  };

  const handleQuickAdjustment = async (productId, newQuantity) => {
    try {
      const inventoryItem = inventory.find(
        (item) => item.productId === productId
      );
      const updatedData = {
        ...inventoryItem,
        quantity: newQuantity,
      };

      await api.put(`/inventory/${productId}`, updatedData);
      toast.success(`Stock updated to ${newQuantity}`);
      fetchInventory();
    } catch (error) {
      toast.error("Failed to update stock.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Inventory Management</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={() => handleOpen()}>
            Add Inventory
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            flex: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="success.main">
            {
              filteredInventory.filter((item) => {
                const { status } = getStockStatus(
                  item.quantity,
                  item.reservedQuantity,
                  item.lowStockAlert
                );
                return status === "In Stock";
              }).length
            }
          </Typography>
          <Typography variant="body2">In Stock</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            flex: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="warning.main">
            {
              filteredInventory.filter((item) => {
                const { status } = getStockStatus(
                  item.quantity,
                  item.reservedQuantity,
                  item.lowStockAlert
                );
                return status === "Low Stock";
              }).length
            }
          </Typography>
          <Typography variant="body2">Low Stock</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            flex: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="error.main">
            {
              filteredInventory.filter((item) => {
                const { status } = getStockStatus(
                  item.quantity,
                  item.reservedQuantity,
                  item.lowStockAlert
                );
                return status === "Out of Stock";
              }).length
            }
          </Typography>
          <Typography variant="body2">Out of Stock</Typography>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="center">Current Stock</TableCell>
            <TableCell align="center">Reserved</TableCell>
            <TableCell align="center">Available</TableCell>
            <TableCell align="center">Low Stock Alert</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Quick Adjust</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInventory.map((item) => {
            const availableStock = item.quantity - item.reservedQuantity;
            const isLowStock = availableStock <= item.lowStockAlert;
            const isOutOfStock = availableStock <= 0;

            return (
              <TableRow
                key={item.productId}
                sx={{
                  backgroundColor: isOutOfStock
                    ? "error.light"
                    : isLowStock
                    ? "warning.light"
                    : "inherit",
                  "&:hover": {
                    backgroundColor: isOutOfStock
                      ? "error.main"
                      : isLowStock
                      ? "warning.main"
                      : "action.hover",
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isLowStock && (
                      <Tooltip title="Low stock warning">
                        <Warning color="warning" fontSize="small" />
                      </Tooltip>
                    )}
                    {getProductName(item.productId)}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="bold">
                    {item.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="center">{item.reservedQuantity}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    color={
                      isOutOfStock
                        ? "error"
                        : isLowStock
                        ? "warning.main"
                        : "success.main"
                    }
                    fontWeight="bold"
                  >
                    {availableStock}
                  </Typography>
                </TableCell>
                <TableCell align="center">{item.lowStockAlert}</TableCell>
                <TableCell align="center">
                  <StockStatusChip
                    currentStock={item.quantity}
                    reservedStock={item.reservedQuantity}
                    lowStockAlert={item.lowStockAlert}
                  />
                </TableCell>
                <TableCell align="center">
                  <QuickStockAdjustment
                    inventory={item}
                    onAdjust={handleQuickAdjustment}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit inventory">
                    <IconButton onClick={() => handleOpen(item)} size="small">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete inventory">
                    <IconButton
                      onClick={() => handleDelete(item.productId)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {filteredInventory.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No inventory records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery
              ? "Try adjusting your search"
              : "Add your first inventory record to get started"}
          </Typography>
        </Box>
      )}

      <InventoryForm
        open={open}
        onClose={handleClose}
        inventory={currentInventory}
        refreshInventory={fetchInventory}
      />
    </Box>
  );
};

export default Inventory;
