import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { promosService } from "../services/promosService";
import PageHeader from "../components/common/PageHeader";
import PromoImageUpload from "../components/promos/PromoImageUpload";
import PromoListSimple from "../components/promos/PromoListSimple";
import ConfirmDialog from "../components/common/ConfirmDialog";
import toast from "react-hot-toast";

const Promos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch promos on component mount
  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const result = await promosService.getAll();
      if (result.data && Array.isArray(result.data)) {
        setPromos(result.data);
      } else {
        console.error("Invalid promo data received:", result);
        setPromos([]);
      }
    } catch (error) {
      console.error("Error fetching promos:", error);
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadConfirm = async (imageUrl) => {
    if (!imageUrl) return;

    setUploading(true);
    try {
      const promoData = {
        imageUrl,
        isActive: true,
        displayOrder: promos.length + 1, // Changed from 'order' to 'displayOrder'
      };

      const result = await promosService.create(promoData);
      if (result.data) {
        setPromos((prev) =>
          Array.isArray(prev) ? [...prev, result.data] : [result.data]
        );
        toast.success("Promo banner added successfully!");
      }
    } catch (error) {
      console.error("Error creating promo:", error);
      toast.error("Failed to create promo");
    } finally {
      setUploading(false);
    }
  };

  const handleReorder = async (reorderedPromos) => {
    try {
      const orderData = reorderedPromos.map((promo, index) => ({
        id: promo.id,
        order: index + 1, // Changed back to 'order' as per API documentation
      }));

      const result = await promosService.reorder({ promos: orderData });
      if (result.data) {
        setPromos(reorderedPromos);
      }
    } catch (error) {
      console.error("Error reordering promos:", error);
      toast.error("Failed to reorder promos");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await promosService.delete(id);
      setPromos((prev) =>
        Array.isArray(prev) ? prev.filter((promo) => promo.id !== id) : []
      );
    } catch (error) {
      console.error("Error deleting promo:", error);
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const result = await promosService.update(id, { isActive });
      if (result.data) {
        setPromos((prev) =>
          Array.isArray(prev)
            ? prev.map((promo) =>
                promo.id === id ? { ...promo, isActive } : promo
              )
            : []
        );
      }
    } catch (error) {
      console.error("Error updating promo status:", error);
      toast.error("Failed to update promo status");
    }
  };

  return (
    <Box>
      <PageHeader title="Promo Banner Management" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Upload Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Promo Banner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload promotional banners with precise preview of how they'll
            appear across all devices.
          </Typography>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <PromoImageUpload
              onConfirm={handleImageUploadConfirm}
              canvaTemplateUrl="https://www.canva.com/design/TEMPLATE_ID/edit"
            />
            {uploading && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ mt: 1, display: "block", textAlign: "center" }}
              >
                Creating promo...
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Promo List Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Manage Promo Banners
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use the arrow buttons to reorder. Toggle status to show/hide
            banners.
          </Typography>
          <PromoListSimple
            promos={promos}
            onReorder={handleReorder}
            onDelete={handleDeleteClick}
            onToggleActive={handleToggleActive}
            loading={loading}
          />
        </Paper>
      </Box>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Promo"
        message="Are you sure you want to delete this promo image? This action cannot be undone."
      />
    </Box>
  );
};

export default Promos;
