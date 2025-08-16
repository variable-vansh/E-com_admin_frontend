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
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {trend.direction === "up" ? (
                <TrendingUp color="success" sx={{ mr: 0.5, fontSize: 16 }} />
              ) : (
                <TrendingDown color="error" sx={{ mr: 0.5, fontSize: 16 }} />
              )}
              <Typography
                variant="caption"
                color={trend.direction === "up" ? "success.main" : "error.main"}
              >
                {trend.percentage}% from last month
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { color })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    lowStockProducts: [],
    recentOrders: [],
    orderStatusDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        usersResponse,
        productsResponse,
        ordersResponse,
        inventoryResponse,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/products"),
        api.get("/orders"),
        api.get("/inventory"),
      ]);

      // Process users data
      const users = usersResponse.data?.data || usersResponse.data || [];
      const totalUsers = Array.isArray(users) ? users.length : 0;

      // Process products data
      const products =
        productsResponse.data?.data || productsResponse.data || [];
      const totalProducts = Array.isArray(products) ? products.length : 0;

      // Process orders data
      const orders = ordersResponse.data?.data || ordersResponse.data || [];
      const totalOrders = Array.isArray(orders) ? orders.length : 0;

      // Get recent orders (last 5)
      const recentOrders = Array.isArray(orders)
        ? orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .slice(0, 5)
        : [];

      // Calculate order status distribution
      const orderStatusDistribution = Array.isArray(orders)
        ? Object.entries(
            orders.reduce((acc, order) => {
              const status = order.orderStatus || order.status || "pending";
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            }, {})
          ).map(([status, count]) => ({
            status,
            count,
            percentage: ((count / orders.length) * 100).toFixed(1),
          }))
        : [];

      // Process inventory data for low stock alerts
      const inventory =
        inventoryResponse.data?.data || inventoryResponse.data || [];
      const lowStockProducts = Array.isArray(inventory)
        ? inventory.filter(
            (item) =>
              item.availableStock <= (item.lowStockAlert || 10) &&
              item.availableStock >= 0
          )
        : [];

      setDashboardData({
        totalUsers,
        totalProducts,
        totalOrders,
        lowStockProducts,
        recentOrders,
        orderStatusDistribution,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "warning",
      confirmed: "info",
      processing: "primary",
      shipped: "secondary",
      delivered: "success",
      cancelled: "error",
      completed: "success",
    };
    return statusColors[status?.toLowerCase()] || "default";
  };

  const {
    totalUsers,
    totalProducts,
    totalOrders,
    lowStockProducts,
    recentOrders,
    orderStatusDistribution,
  } = dashboardData;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards - Updated to 3-column layout without revenue */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<People />}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory />}
            color="secondary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart />}
            color="info"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{ height: "400px", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Orders</Typography>
                <Chip
                  label={`${recentOrders.length} orders`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              {recentOrders.length > 0 ? (
                <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
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
                          <TableCell>
                            #{order.orderNumber || order.id}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell align="right">
                            $
                            {Number(
                              order.totalAmount || order.grandTotal || 0
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.orderStatus || order.status}
                              color={getStatusColor(
                                order.orderStatus || order.status
                              )}
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
                </Box>
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
          <Card
            sx={{ height: "400px", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Order Status</Typography>
                <Chip
                  label="Live Stats"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
              {orderStatusDistribution.length > 0 ? (
                <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                  <List dense>
                    {orderStatusDistribution.map(
                      ({ status, count, percentage }) => (
                        <ListItem key={status} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                            <Chip
                              label={status}
                              color={getStatusColor(status)}
                              size="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  {count} orders
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {percentage}%
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No order data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alerts */}
      <Grid container spacing={3}>
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
