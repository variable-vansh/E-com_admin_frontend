import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  getCustomerOrderId,
  getSystemOrderId,
  extractOrderId,
} from "../../utils/orderUtils";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
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

const getPaymentStatusColor = (status) => {
  const colors = {
    PENDING: "warning",
    PAID: "success",
    FAILED: "error",
    REFUNDED: "default",
  };
  return colors[status] || "default";
};

const OrderDetailsModal = ({ open, onClose, order, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus || order.status || "PENDING");
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (newStatus !== (order.orderStatus || order.status)) {
      await onStatusUpdate(order.id, newStatus);
      onClose();
    }
  };

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5">
            Order Details - #{extractOrderId(order)}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Chip
                    label={order.orderStatus || order.status}
                    color={getStatusColor(order.orderStatus || order.status)}
                    size="small"
                    variant="filled"
                  />
                  <Chip
                    label={order.paymentStatus || "PENDING"}
                    color={getPaymentStatusColor(
                      order.paymentStatus || "PENDING"
                    )}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Customer Order ID:</strong> #
                      {getCustomerOrderId(order)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>System Order ID:</strong>{" "}
                      {getSystemOrderId(order)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Order Date:</strong>{" "}
                      {new Date(
                        order.createdAt ||
                          order.orderDate ||
                          order.orderTimestamp
                      ).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {order.customerName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {order.customerPhone}
                </Typography>
                {order.customerEmail && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Email:</strong> {order.customerEmail}
                  </Typography>
                )}
                {order.user && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Username:</strong> {order.user.username}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Delivery Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Delivery Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Address:</strong>{" "}
                  {order.fullAddress || order.shippingAddress?.street || "N/A"}
                </Typography>
                {order.shippingAddress && (
                  <>
                    <Typography variant="body2" gutterBottom>
                      <strong>City:</strong> {order.shippingAddress.city}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>State:</strong> {order.shippingAddress.state}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Zip Code:</strong> {order.shippingAddress.zipCode}
                    </Typography>
                  </>
                )}
                {order.pincode && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Pincode:</strong> {order.pincode}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          {order.orderItems?.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items ({order.orderItems.length})
                  </Typography>
                  <List>
                    {order.orderItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              item.productName ||
                              `Product ID: ${item.productId}`
                            }
                            secondary={`Quantity: ${
                              item.quantity
                            } × ₹${item.price?.toFixed(
                              2
                            )} = ₹${item.totalPrice?.toFixed(2)}`}
                          />
                        </ListItem>
                        {index < order.orderItems.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Custom Mix Items */}
          {order.orderMixItems?.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Custom Mix Items ({order.orderMixItems.length})
                  </Typography>
                  <List>
                    {order.orderMixItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              item.grainName || `Grain ID: ${item.grainId}`
                            }
                            secondary={`Quantity: ${
                              item.quantity
                            }kg × ₹${item.price?.toFixed(
                              2
                            )} = ₹${item.totalPrice?.toFixed(2)}`}
                          />
                        </ListItem>
                        {index < order.orderMixItems.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Order Items (fallback for different API format) */}
          {order.items?.length > 0 && !order.orderItems && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items ({order.items.length})
                  </Typography>
                  <List>
                    {order.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              item.productName ||
                              `Product ID: ${item.productId}`
                            }
                            secondary={`Quantity: ${
                              item.quantity
                            } × ₹${item.price?.toFixed(2)} = ₹${(
                              item.quantity * item.price
                            )?.toFixed(2)}`}
                          />
                        </ListItem>
                        {index < order.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Pricing Breakdown */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pricing Breakdown
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {order.itemTotal && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Item Total:</Typography>
                      <Typography>₹{order.itemTotal.toFixed(2)}</Typography>
                    </Box>
                  )}
                  {order.deliveryFee && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Delivery Fee:</Typography>
                      <Typography>₹{order.deliveryFee.toFixed(2)}</Typography>
                    </Box>
                  )}
                  {order.discount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "success.main",
                      }}
                    >
                      <Typography>Discount:</Typography>
                      <Typography>-₹{order.discount.toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    <Typography variant="h6">Grand Total:</Typography>
                    <Typography variant="h6">
                      ₹{(order.grandTotal || order.totalAmount)?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
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
                    disabled={newStatus === (order.orderStatus || order.status)}
                  >
                    Update Status
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
