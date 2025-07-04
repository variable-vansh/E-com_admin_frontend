import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
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

const ProductForm = ({ open, onClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData(product);
      } else {
        const initialFormData = {
          name: "",
          description: "",
          price: "",
          isActive: true,
          categoryId: "",
        };
        setFormData(initialFormData);
      }
    } else {
      setFormData({});
    }
  }, [open, product]); // Set default category when categories are loaded for new products
  useEffect(() => {
    if (open && !product && categories.length > 0) {
      setFormData((prev) => {
        // Only set if categoryId is empty to avoid overriding user selection
        if (!prev.categoryId) {
          return {
            ...prev,
            categoryId: categories[0].id,
          };
        }
        return prev;
      });
    }
  }, [open, product, categories]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };
    try {
      if (product) {
        await api.put(`/products/${product.id}`, productData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", productData);
        toast.success("Product created successfully");
      }
      refreshProducts();
      onClose();
    } catch (error) {
      toast.error("Failed to save product.");
    }
  };
  if (!open) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">{product ? "Edit" : "Add"} Product</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />{" "}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              label="Category"
              required
            >
              {" "}
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
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleChange}
              />
            }
            label="Active"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {product ? "Update" : "Create"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/products/search?q=${searchQuery}`
        : "/products";
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpen = (product = null) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product.");
      }
    }
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
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
        <Typography variant="h4">Products</Typography>
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>{" "}
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </TableCell>
              <TableCell>{getCategoryName(product.categoryId)}</TableCell>
              <TableCell>{product.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(product)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(product.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ProductForm
        open={open}
        onClose={handleClose}
        product={currentProduct}
        refreshProducts={fetchProducts}
      />
    </Box>
  );
};

export default Products;
