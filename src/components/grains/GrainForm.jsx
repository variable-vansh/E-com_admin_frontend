import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import ImageUpload from "../common/ImageUpload";
import "../common/FormStyles.css";

const GrainForm = ({ open, onClose, grain, onSubmit, grains }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grain) {
      setFormData({
        name: grain.name || "",
        description: grain.description || "",
        price: grain.price || "",
        stock: grain.stock || "",
        image: grain.image || "",
        isActive: grain.isActive !== undefined ? grain.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [grain, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (
      grains.some(
        (g) =>
          g.name.toLowerCase() === formData.name.toLowerCase() &&
          g.id !== grain?.id
      )
    ) {
      newErrors.name = "Grain name already exists";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required";
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error submitting grain:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
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
            {grain ? "Edit Grain" : "Add New Grain"}
          </Typography>
        </DialogTitle>

        <DialogContent className="form-dialog-content">
          <div className="form-container">
            {/* Left Column - Form Fields */}
            <div className="form-fields-column">
              <Typography variant="subtitle1" className="form-section-title">
                Grain Information
              </Typography>
              <Divider className="form-divider" />

              <div className="form-inputs-container">
                <TextField
                  className="form-text-field"
                  label="Grain Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  placeholder="Enter grain name"
                />

                <TextField
                  className="form-text-field"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Enter grain description"
                />

                <TextField
                  className="form-text-field"
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  error={!!errors.price}
                  helperText={errors.price}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                  placeholder="0.00"
                />

                <TextField
                  className="form-text-field"
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange("stock")}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  inputProps={{ min: 0 }}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Right Column - Image Upload & Controls */}
            <div className="form-controls-column">
              {/* Image Upload Section */}
              <div>
                <Divider className="form-divider" />
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  bucket="grains"
                  folder="grain-images"
                  label="Upload Grain Image"
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
                            ? "Grain is available for purchase"
                            : "Grain is not available for purchase"}
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
                    : grain
                    ? "Update Grain"
                    : "Create Grain"}
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

export default GrainForm;
