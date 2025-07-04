import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  Warning,
  TrendingUp,
  TrendingDown,
  Schedule,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import api from "../services/api";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  loading,
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {trend > 0 ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? "success.main" : "error.main"}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, {
            sx: { fontSize: 40, color: `${color}.main` },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

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

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes, inventoryRes] =
        await Promise.all([
          api.get("/users"),
          api.get("/products"),
          api.get("/orders"),
          api.get("/inventory").catch(() => ({ data: [] })), // Handle case where inventory endpoint might not exist
        ]);

      const users = usersRes.data;
      const products = productsRes.data;
      const orders = ordersRes.data;
      const inventory = inventoryRes.data;

      // Calculate stats
      const revenue = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      setStats({
        users: users.length,
        products: products.length,
        orders: orders.length,
        revenue: revenue,
      });

      // Get recent orders (last 10)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 10);
      setRecentOrders(sortedOrders);

      // Calculate order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const statusDistribution = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status,
          count,
          percentage: ((count / orders.length) * 100).toFixed(1),
        })
      );
      setOrderStatusDistribution(statusDistribution);

      // Get low stock products
      const lowStock = inventory
        .filter((item) => {
          const availableStock = item.quantity - (item.reservedQuantity || 0);
          return availableStock <= (item.lowStockAlert || 10);
        })
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            ...item,
            productName: product?.name || `Product ID: ${item.productId}`,
            availableStock: item.quantity - (item.reservedQuantity || 0),
          };
        })
        .sort((a, b) => a.availableStock - b.availableStock)
        .slice(0, 10);

      setLowStockProducts(lowStock);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your e-commerce admin dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.users.toLocaleString()}
            icon={<People />}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products.toLocaleString()}
            icon={<Inventory />}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.orders.toLocaleString()}
            icon={<ShoppingCart />}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}`}
            icon={<AttachMoney />}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              {recentOrders.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.orderNumber || order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell align="right">
                          ${order.totalAmount?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No orders found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              {orderStatusDistribution.length > 0 ? (
                <List dense>
                  {orderStatusDistribution.map(
                    ({ status, count, percentage }) => (
                      <ListItem key={status} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                          <Chip
                            label={status}
                            color={getStatusColor(status)}
                            size="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${count} orders`}
                          secondary={`${percentage}%`}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No order data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Low Stock Alerts</Typography>
              </Box>

              {lowStockProducts.length > 0 ? (
                <>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {lowStockProducts.length} product(s) are running low on
                    stock
                  </Alert>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="center">Available Stock</TableCell>
                        <TableCell align="center">Reserved</TableCell>
                        <TableCell align="center">Alert Threshold</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockProducts.map((item) => (
                        <TableRow
                          key={item.productId}
                          sx={{
                            backgroundColor:
                              item.availableStock <= 0
                                ? "error.light"
                                : "warning.light",
                          }}
                        >
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="center">
                            <Typography
                              color={
                                item.availableStock <= 0
                                  ? "error"
                                  : "warning.main"
                              }
                              fontWeight="bold"
                            >
                              {item.availableStock}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {item.reservedQuantity || 0}
                          </TableCell>
                          <TableCell align="center">
                            {item.lowStockAlert || 10}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                item.availableStock <= 0
                                  ? "Out of Stock"
                                  : "Low Stock"
                              }
                              color={
                                item.availableStock <= 0 ? "error" : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <Alert severity="success">All products are well stocked!</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
