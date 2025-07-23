import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { productsService, categoriesService } from "../services/crudService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

const Products = () => {
  const {
    data: products,
    loading,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
    fetchData,
  } = useCrud(productsService);

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories separately
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoriesService.getAll();
      setCategories(result.data || []);
    };
    fetchCategories();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchItems(searchQuery);
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchItems, fetchData]);

  const handleOpen = (product = null) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async (productData) => {
    if (currentProduct) {
      await updateItem(currentProduct.id, productData);
    } else {
      await createItem(productData);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    await deleteItem(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box>
      <PageHeader
        title="Products"
        actionButton={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
              sx={{ width: 300 }}
            />
            <Button variant="contained" onClick={() => handleOpen()}>
              Add Product
            </Button>
          </Box>
        }
      />

      <ProductTable
        products={products}
        categories={categories}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <ProductForm
        open={open}
        onClose={handleClose}
        product={currentProduct}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </Box>
  );
};

export default Products;
