import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import api from "../services/api";

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

const CategoryForm = ({ open, onClose, category, refreshCategories }) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId || "");
    } else {
      setName("");
      setParentId("");
    }
  }, [category]);

  useEffect(() => {
    const fetchCategoriesForDropdown = async () => {
      try {
        const response = await api.get("/categories");
        setAllCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories for dropdown.");
      }
    };
    if (open) {
      fetchCategoriesForDropdown();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name, parentId: parentId || null };
    try {
      if (category) {
        await api.put(`/categories/${category.id}`, categoryData);
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", categoryData);
        toast.success("Category created successfully");
      }
      refreshCategories();
      onClose();
    } catch (error) {
      toast.error("Failed to save category.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">
          {category ? "Edit" : "Add"} Category
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category</InputLabel>
            <Select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              label="Parent Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>{" "}
              {allCategories.map((cat) => (
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
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {category ? "Update" : "Create"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = (category = null) => {
    setCurrentCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCategory(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category.");
      }
    }
  };
  const getCategoryNameById = (id) => {
    if (!id) return "N/A";
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown";
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Categories</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Parent Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>{" "}
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{getCategoryNameById(category.parentId)}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(category)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(category.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryForm
        open={open}
        onClose={handleClose}
        category={currentCategory}
        refreshCategories={fetchCategories}
      />
    </Box>
  );
};

export default Categories;
