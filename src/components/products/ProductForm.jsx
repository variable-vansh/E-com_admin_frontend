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
  Grid,
  Divider,
  Typography,
  Paper,
} from "@mui/material";
import { categoriesService } from "../../services/crudService";
import ImageUpload from "../common/ImageUpload";
import "../common/FormStyles.css";

const ProductForm = ({ open, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    isActive: true,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (open) {
        const result = await categoriesService.getAll();
        setCategories(result.data || []);
      }
    };
    fetchCategories();
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId || "",
        image: product.image || "",
        isActive: product.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        image: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [product, open, categories]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await onSubmit(productData);
      handleClose();
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="form-dialog"
      maxWidth="lg"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="form-dialog-title">
          <Typography variant="h6" component="div">
            {product ? "Edit Product" : "Add New Product"}
          </Typography>
        </DialogTitle>

        <DialogContent className="form-dialog-content">
          <div className="form-container">
            {/* Left Column - Form Fields */}
            <div className="form-fields-column">
              <Typography variant="subtitle1" className="form-section-title">
                Product Information
              </Typography>
              <Divider className="form-divider" />

              <div className="form-inputs-container">
                <TextField
                  className="form-text-field"
                  label="Product Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  placeholder="Enter product name"
                />

                <TextField
                  className="form-text-field"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  multiline
                  rows={3}
                  placeholder="Enter product description"
                />

                <TextField
                  className="form-text-field"
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                  inputProps={{ min: 0, step: "0.01" }}
                  placeholder="0.00"
                />

                <FormControl
                  className="form-select"
                  error={!!errors.categoryId}
                >
                  <InputLabel required>Category</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={handleChange("categoryId")}
                    label="Category"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography className="form-select-error-text">
                      {errors.categoryId}
                    </Typography>
                  )}
                </FormControl>
              </div>
            </div>

            {/* Right Column - Image Upload & Controls */}
            <div className="form-controls-column">
              {/* Image Upload Section */}
              <div>
                <Divider className="form-divider" />
                <ImageUpload
                  value={formData.image}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                  bucket="products"
                  folder="product-images"
                  size={250}
                />
              </div>

              {/* Status Controls */}
              <div>
                <Typography variant="subtitle1" className="form-section-title">
                  Status
                </Typography>
                <Divider className="form-divider" />
                <div className="status-paper">
                  <FormControlLabel
                    className="form-switch-container"
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleChange("isActive")}
                        color="primary"
                      />
                    }
                    label={
                      <div className="status-label-container">
                        <Typography variant="body2" className="status-title">
                          {formData.isActive ? "Active" : "Inactive"}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="status-description"
                        >
                          {formData.isActive
                            ? "Product is visible to customers"
                            : "Product is hidden from customers"}
                        </Typography>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  className="form-submit-button"
                >
                  {loading
                    ? "Saving..."
                    : product
                    ? "Update Product"
                    : "Create Product"}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  disabled={loading}
                  size="large"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ProductForm;
