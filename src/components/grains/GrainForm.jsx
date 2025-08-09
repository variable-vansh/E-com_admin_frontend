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
} from "@mui/material";

const GrainForm = ({ open, onClose, grain, onSubmit, grains }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (grain) {
      setFormData({
        name: grain.name || "",
        description: grain.description || "",
        price: grain.price || "",
        stock: grain.stock || "",
        isActive: grain.isActive !== undefined ? grain.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      onSubmit(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{grain ? "Edit Grain" : "Add New Grain"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  error={!!errors.price}
                  helperText={errors.price}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange("stock")}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange("isActive")}
                      color="primary"
                    />
                  }
                  label="Active Status"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {grain ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GrainForm;
