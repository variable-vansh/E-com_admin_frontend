import { useState } from "react";
import { Box, Button } from "@mui/material";
import { categoriesService } from "../services/crudService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";

const Categories = () => {
  const {
    data: categories,
    loading,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(categoriesService);

  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const handleOpen = (category = null) => {
    setCurrentCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCategory(null);
  };

  const handleSubmit = async (categoryData) => {
    if (currentCategory) {
      await updateItem(currentCategory.id, categoryData);
    } else {
      await createItem(categoryData);
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
        title="Categories"
        actionButton={
          <Button variant="contained" onClick={() => handleOpen()}>
            Add Category
          </Button>
        }
      />

      <CategoryTable
        categories={categories}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <CategoryForm
        open={open}
        onClose={handleClose}
        category={currentCategory}
        onSubmit={handleSubmit}
        categories={categories}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </Box>
  );
};

export default Categories;
