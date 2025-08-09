import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { grainsService } from "../services/crudService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import GrainForm from "../components/grains/GrainForm";
import GrainTable from "../components/grains/GrainTable";

const Grains = () => {
  const {
    data: grains,
    loading,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
    fetchData,
  } = useCrud(grainsService);

  const [open, setOpen] = useState(false);
  const [currentGrain, setCurrentGrain] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchItems(searchQuery.trim()); // Now this is just client-side filtering
    }, 300); // Reduced delay for better UX

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchItems]);

  const handleOpen = (grain = null) => {
    setCurrentGrain(grain);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentGrain(null);
  };

  const handleSubmit = async (grainData) => {
    if (currentGrain) {
      await updateItem(currentGrain.id, grainData);
    } else {
      await createItem(grainData);
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
        title="Grains"
        actionButton={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search grains..."
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Grain
            </Button>
          </Box>
        }
      />

      <GrainTable
        grains={grains}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <GrainForm
        open={open}
        onClose={handleClose}
        grain={currentGrain}
        onSubmit={handleSubmit}
        grains={grains}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Grain"
        message="Are you sure you want to delete this grain? This action cannot be undone."
      />
    </Box>
  );
};

export default Grains;
