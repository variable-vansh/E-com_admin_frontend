import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
import "../common/FormStyles.css";

const CouponForm = ({ open, onClose, coupon, onSubmit, products = [] }) => {
  const [formData, setFormData] = useState({
    type: "additional_item",
    name: "",
    description: "",
    isActive: true,
    productId: "",
    minOrderAmount: "",
    code: "",
    discountAmount: "",
    minOrderAmountForDiscount: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        type: coupon.type || "additional_item",
        name: coupon.name || "",
        description: coupon.description || "",
        isActive: coupon.isActive ?? true,
        productId: coupon.productId || "",
        minOrderAmount: coupon.minOrderAmount || "",
        code: coupon.code || "",
        discountAmount: coupon.discountAmount || "",
        minOrderAmountForDiscount: coupon.minOrderAmountForDiscount || "",
      });
    } else {
      setFormData((prev) => ({
        type: prev.type || "additional_item",
        name: "",
        description: "",
        isActive: true,
        productId: "",
        minOrderAmount: "",
        code: "",
        discountAmount: "",
        minOrderAmountForDiscount: "",
      }));
    }
    setErrors({});
  }, [coupon, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Coupon name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.type === "additional_item") {
      if (!formData.productId) {
        newErrors.productId = "Product selection is required";
      }
      if (
        !formData.minOrderAmount ||
        isNaN(formData.minOrderAmount) ||
        parseFloat(formData.minOrderAmount) <= 0
      ) {
        newErrors.minOrderAmount =
          "Minimum order amount must be a positive number";
      }
    } else if (formData.type === "discount_code") {
      if (!formData.code.trim()) {
        newErrors.code = "Coupon code is required";
      } else if (formData.code.length < 3) {
        newErrors.code = "Coupon code must be at least 3 characters";
      }
      if (
        !formData.discountAmount ||
        isNaN(formData.discountAmount) ||
        parseFloat(formData.discountAmount) <= 0
      ) {
        newErrors.discountAmount = "Discount amount must be a positive number";
      }
      if (
        !formData.minOrderAmountForDiscount ||
        isNaN(formData.minOrderAmountForDiscount) ||
        parseFloat(formData.minOrderAmountForDiscount) <= 0
      ) {
        newErrors.minOrderAmountForDiscount =
          "Minimum order amount must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        type: formData.type,
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (formData.type === "additional_item") {
        submitData.productId = formData.productId;
        submitData.minOrderAmount = parseFloat(formData.minOrderAmount);
      } else if (formData.type === "discount_code") {
        submitData.code = formData.code.trim().toUpperCase();
        submitData.discountAmount = parseFloat(formData.discountAmount);
        submitData.minOrderAmountForDiscount = parseFloat(
          formData.minOrderAmountForDiscount
        );
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedProduct = () => {
    return products.find((p) => p.id === formData.productId) || null;
  };

  const isEditing = coupon && coupon.id;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 3,
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <LocalOffer sx={{ color: "#6c757d" }} />
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 500, color: "#495057" }}
        >
          {isEditing ? "Edit Coupon" : "Create New Coupon"}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Coupon Type */}
            <FormControl fullWidth required>
              <InputLabel>Coupon Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                label="Coupon Type"
                disabled={isEditing}
              >
                <MenuItem value="additional_item">
                  Additional Item Coupon
                </MenuItem>
                <MenuItem value="discount_code">Discount Code Coupon</MenuItem>
              </Select>
            </FormControl>

            {/* Coupon Name */}
            <TextField
              fullWidth
              label="Coupon Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={2}
              required
            />

            {/* Active Status */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label="Active"
            />

            {/* Conditional fields based on coupon type */}
            {formData.type === "additional_item" && (
              <>
                {/* Free Product */}
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) =>
                    `${option.name} - ₹${option.price}`
                  }
                  value={getSelectedProduct()}
                  onChange={(event, newValue) => {
                    handleChange("productId", newValue ? newValue.id : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Free Product"
                      error={!!errors.productId}
                      helperText={
                        errors.productId ||
                        "Select product to be given for free"
                      }
                      required
                    />
                  )}
                />

                {/* Minimum Order Amount */}
                <TextField
                  fullWidth
                  label="Minimum Order Amount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    handleChange("minOrderAmount", e.target.value)
                  }
                  helperText={errors.minOrderAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  required
                />
              </>
            )}

            {formData.type === "discount_code" && (
              <>
                {/* Coupon Code */}
                <TextField
                  fullWidth
                  label="Coupon Code"
                  value={formData.code}
                  onChange={(e) =>
                    handleChange("code", e.target.value.toUpperCase())
                  }
                  error={!!errors.code}
                  helperText={errors.code}
                  placeholder="e.g., SAVE20"
                  required
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    },
                  }}
                />

                {/* Discount Amount */}
                <TextField
                  fullWidth
                  label="Discount Amount"
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) =>
                    handleChange("discountAmount", e.target.value)
                  }
                  error={!!errors.discountAmount}
                  helperText={errors.discountAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  required
                />

                {/* Minimum Order Amount */}
                <TextField
                  fullWidth
                  label="Minimum Order Amount"
                  type="number"
                  value={formData.minOrderAmountForDiscount}
                  onChange={(e) =>
                    handleChange("minOrderAmountForDiscount", e.target.value)
                  }
                  error={!!errors.minOrderAmountForDiscount}
                  helperText={errors.minOrderAmountForDiscount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  required
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2, borderTop: "1px solid #e9ecef" }}>
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouponForm;
