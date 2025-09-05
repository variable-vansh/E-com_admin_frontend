import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Chip,
  Typography,
  Box,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  LocalOffer,
  CardGiftcard,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const CouponTable = ({
  coupons,
  products = [],
  onEdit,
  onDelete,
  loading,
  couponType,
}) => {
  const getProductName = (productId) => {
    const product = products.find((prod) => prod.id === productId);
    return product ? product.name : "Product Not Found";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusChip = (coupon) => {
    if (!coupon.isActive) {
      return <Chip label="Inactive" color="error" size="small" />;
    }

    return <Chip label="Active" color="success" size="small" />;
  };

  // Remove usage progress function since backend doesn't track usage limits
  // const getUsageProgress = (coupon) => { ... }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coupons.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No{" "}
          {couponType === "additional_item"
            ? "additional item"
            : "discount code"}{" "}
          coupons found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your first coupon to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Name</TableCell>
          {couponType === "additional_item" ? (
            <>
              <TableCell>Free Product</TableCell>
              <TableCell>Min. Order Amount</TableCell>
            </>
          ) : (
            <>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Min. Order Amount</TableCell>
            </>
          )}
          <TableCell>Created</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {coupons.map((coupon) => (
          <TableRow key={coupon.id}>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {coupon.type === "additional_item" ? (
                  <CardGiftcard color="primary" />
                ) : (
                  <LocalOffer color="secondary" />
                )}
                <Typography variant="caption" color="textSecondary">
                  {coupon.type === "additional_item"
                    ? "Additional Item"
                    : "Discount Code"}
                </Typography>
              </Box>
            </TableCell>

            <TableCell>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {coupon.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {coupon.description}
                </Typography>
              </Box>
            </TableCell>

            {coupon.type === "additional_item" ? (
              <>
                <TableCell>
                  <Typography variant="body2">
                    {getProductName(coupon.productId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(coupon.minOrderAmount)}
                  </Typography>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  <Chip
                    label={coupon.code}
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: "monospace" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="success.main"
                  >
                    {formatCurrency(coupon.discountAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(coupon.minOrderAmountForDiscount)}
                  </Typography>
                </TableCell>
              </>
            )}

            <TableCell>
              <Typography variant="caption" color="textSecondary">
                {formatDate(coupon.createdAt)}
              </Typography>
            </TableCell>

            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusChip(coupon)}
                {coupon.isActive ? (
                  <Visibility color="success" fontSize="small" />
                ) : (
                  <VisibilityOff color="error" fontSize="small" />
                )}
              </Box>
            </TableCell>

            <TableCell>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Tooltip title="Edit Coupon">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(coupon)}
                    color="primary"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Coupon">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(coupon.id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CouponTable;
