import React from "react";
import { Box, Grid, Card, CardContent, Typography, Chip } from "@mui/material";

const OrderStats = ({ stats }) => {
  if (!stats) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">-</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">₹-</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h4">₹-</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4">-</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  const pendingCount =
    stats.statusBreakdown?.find((s) => s.orderStatus === "PENDING")?._count
      ?.id || 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">{stats._count?.id || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h4">
              ₹{stats._sum?.grandTotal?.toFixed(2) || "0.00"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Average Order Value
            </Typography>
            <Typography variant="h4">
              ₹{stats._avg?.grandTotal?.toFixed(2) || "0.00"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pending Orders
            </Typography>
            <Typography variant="h4" color="warning.main">
              {pendingCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Breakdown */}
      {stats.statusBreakdown && stats.statusBreakdown.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {stats.statusBreakdown.map((status, index) => (
                  <Chip
                    key={index}
                    label={`${status.orderStatus}: ${status._count.id}`}
                    color={getStatusColor(status.orderStatus)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

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

export default OrderStats;
