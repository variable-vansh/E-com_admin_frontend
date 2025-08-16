import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

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

const getPaymentStatusColor = (status) => {
  const colors = {
    PENDING: "warning",
    PAID: "success",
    FAILED: "error",
    REFUNDED: "default",
  };
  return colors[status] || "default";
};

const OrderTable = ({ orders, onStatusUpdate, loading }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No orders found
        </Typography>
      </Box>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Customer</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Items</TableCell>
          <TableCell align="right">Total Amount</TableCell>
          <TableCell>Order Status</TableCell>
          <TableCell>Payment Status</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Order Status Update</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <>
            <TableRow key={order.id}>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {order.customerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {order.customerPhone}
                  </Typography>
                  {order.customerEmail && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {order.customerEmail}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {order.fullAddress || order.address || "N/A"}
                  </Typography>
                  {order.pincode && (
                    <Typography variant="caption" color="text.secondary">
                      PIN: {order.pincode}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                <Box>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => toggleRowExpansion(order.id)}
                    startIcon={
                      expandedRows.has(order.id) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    }
                    sx={{ minWidth: "auto", p: 0.5 }}
                  >
                    <Typography variant="body2">
                      {(order.orderItems?.length || 0) +
                        (order.orderMixItems?.length || 0)}{" "}
                      items
                    </Typography>
                  </Button>
                  {order.orderItems?.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      ml={1}
                    >
                      {order.orderItems.length} products
                    </Typography>
                  )}
                  {order.orderMixItems?.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      ml={1}
                    >
                      {order.orderMixItems.length} custom mix
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  ₹{Number(order.grandTotal || 0).toFixed(2)}
                </Typography>
                {order.itemTotal && (
                  <Typography variant="caption" color="text.secondary">
                    Items: ₹{Number(order.itemTotal || 0).toFixed(2)}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Chip
                  label={order.orderStatus || "PENDING"}
                  color={getStatusColor(order.orderStatus || "PENDING")}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={order.paymentStatus || "PENDING"}
                  color={getPaymentStatusColor(
                    order.paymentStatus || "PENDING"
                  )}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {new Date(
                    order.createdAt || order.orderTimestamp
                  ).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(
                    order.createdAt || order.orderTimestamp
                  ).toLocaleTimeString()}
                </Typography>
              </TableCell>

              <TableCell>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={order.orderStatus || "PENDING"}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                    displayEmpty
                  >
                    {ORDER_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Expandable Row for Order Items */}
            <TableRow key={`${order.id}-details`}>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={8}
              >
                <Collapse
                  in={expandedRows.has(order.id)}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box
                    sx={{
                      margin: 2,
                      padding: 2,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 2,
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        borderBottom: "2px solid",
                        borderColor: "primary.light",
                        pb: 1,
                        mb: 2,
                      }}
                    >
                      Order Items Detail
                    </Typography>

                    {/* Regular Products */}
                    {order.orderItems?.length > 0 && (
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: "white",
                          borderRadius: 1,
                          border: "1px solid #e3f2fd",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          🛍️ Products ({order.orderItems.length})
                        </Typography>
                        <List dense sx={{ "& .MuiListItem-root": { py: 0.5 } }}>
                          {order.orderItems.map((item, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                pl: 0,
                                borderBottom:
                                  index < order.orderItems.length - 1
                                    ? "1px solid #f5f5f5"
                                    : "none",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: 1,
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {item.productName ||
                                        `Product ID: ${item.productId}`}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ₹{Number(item.totalPrice || 0).toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Qty: {item.quantity} × ₹
                                    {Number(item.price || 0).toFixed(2)}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Mix Items */}
                    {order.orderMixItems?.length > 0 && (
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: "white",
                          borderRadius: 1,
                          border: "1px solid #fff3e0",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            color: "secondary.main",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          🌾 Custom Mix Items ({order.orderMixItems.length})
                        </Typography>
                        <List dense sx={{ "& .MuiListItem-root": { py: 0.5 } }}>
                          {order.orderMixItems.map((item, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                pl: 0,
                                borderBottom:
                                  index < order.orderMixItems.length - 1
                                    ? "1px solid #f5f5f5"
                                    : "none",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: 1,
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {item.grainName ||
                                        `Grain ID: ${item.grainId}`}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ₹{Number(item.totalPrice || 0).toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Qty: {item.quantity}kg × ₹
                                    {Number(item.price || 0).toFixed(2)}/kg
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Summary */}
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "primary.light",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "primary.contrastText",
                        }}
                      >
                        📦 Total Items:{" "}
                        {(order.orderItems?.length || 0) +
                          (order.orderMixItems?.length || 0)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "primary.contrastText",
                        }}
                      >
                        💰 Grand Total: ₹
                        {Number(order.grandTotal || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
