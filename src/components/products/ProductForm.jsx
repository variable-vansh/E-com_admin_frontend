import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { categoriesService } from "../../services/crudService";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProductForm = ({ open, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isActive: true,
  });
  const [categories, setCategories] = useState([]);

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
        isActive: product.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        isActive: true,
      });
    }
  }, [product, open, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    await onSubmit(productData);
    onClose();
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {product ? "Edit" : "Add"} Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange("name")}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange("price")}
            fullWidth
            required
            margin="normal"
            inputProps={{ step: "0.01", min: "0" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categoryId}
              onChange={handleChange("categoryId")}
              label="Category"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleChange("isActive")}
              />
            }
            label="Active"
          />
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              {product ? "Update" : "Create"}
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ProductForm;
