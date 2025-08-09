import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { grainsService } from "../services/crudService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
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
    refetch,
  } = useCrud(grainsService);

  const [open, setOpen] = useState(false);
  const [currentGrain, setCurrentGrain] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deactivateDialog, setDeactivateDialog] = useState({
    open: false,
    id: null,
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, [grains]); // Refetch stats when grains change

  const fetchStats = async () => {
    // Calculate stats from current grains data
    const total = grains.length;
    const active = grains.filter((g) => g.isActive).length;
    const inactive = total - active;
    const lowStock = grains.filter((g) => g.stock < 10).length;

    setStats({ total, active, inactive, lowStock });
  };

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

  const handleDeactivateClick = (id) => {
    setDeactivateDialog({ open: true, id });
  };

  const handleDeactivateConfirm = async () => {
    // For deactivation, we'll update the grain with isActive: false
    const grain = grains.find((g) => g.id === deactivateDialog.id);
    if (grain) {
      await updateItem(grain.id, { ...grain, isActive: false });
    }
    setDeactivateDialog({ open: false, id: null });
  };

  const StatCard = ({ title, value, color = "primary" }) => (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color={color} fontWeight="bold">
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <PageHeader
        title="Grains Management"
        actionButton={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Grain
          </Button>
        }
      />

      {/* Stats Cards */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Grains" value={stats.total} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Grains"
              value={stats.active}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Inactive Grains"
              value={stats.inactive}
              color="text.secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              color="error.main"
            />
          </Grid>
        </Grid>
      </Box>

      <GrainTable
        grains={grains}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        onDeactivate={handleDeactivateClick}
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

      <ConfirmDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, id: null })}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Grain"
        message="Are you sure you want to deactivate this grain?"
      />
    </Box>
  );
};

export default Grains;
