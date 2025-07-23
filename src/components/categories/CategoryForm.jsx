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
} from "@mui/material";

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

const CategoryForm = ({
  open,
  onClose,
  category,
  onSubmit,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        parentId: category.parentId || "",
      });
    } else {
      setFormData({ name: "", parentId: "" });
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      name: formData.name,
      parentId: formData.parentId || null,
    };

    await onSubmit(categoryData);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {category ? "Edit" : "Add"} Category
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category</InputLabel>
            <Select
              value={formData.parentId}
              onChange={handleChange("parentId")}
              label="Parent Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  value={cat.id}
                  disabled={category && category.id === cat.id}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              {category ? "Update" : "Create"}
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

export default CategoryForm;
