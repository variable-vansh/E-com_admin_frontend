import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Switch,
  Chip,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Delete,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const PromoListSimple = ({
  promos = [],
  onReorder,
  onDelete,
  onToggleActive,
  loading = false,
}) => {
  const moveItem = (index, direction) => {
    const newPromos = [...promos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPromos.length) {
      return;
    }

    [newPromos[index], newPromos[targetIndex]] = [
      newPromos[targetIndex],
      newPromos[index],
    ];
    onReorder(newPromos);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!promos.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={200}
        sx={{
          border: "2px dashed",
          borderColor: "grey.300",
          borderRadius: 2,
          backgroundColor: "grey.50",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Promo Images Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first promo image to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {promos.map((promo, index) => (
        <Card
          key={promo.id}
          sx={{
            mb: 3,
            overflow: "hidden",
          }}
        >
          {/* Banner Preview with Responsive Heights */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 160, // Desktop preview height
              overflow: "hidden",
              borderRadius: 1,
            }}
          >
            <img
              src={promo.imageUrl}
              alt={`Promo Banner ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Preview Labels */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <Chip
                size="small"
                label={`#${promo.displayOrder || index + 1}`}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                size="small"
                label={promo.isActive ? "Active" : "Inactive"}
                color={promo.isActive ? "success" : "default"}
                icon={
                  promo.isActive ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )
                }
              />
            </Box>

            {/* Overlay with device previews */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                color: "white",
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: "block", opacity: 0.9 }}
                >
                  Preview: Desktop (200px) • Tablet (160px) • Mobile (140px)
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Created: {new Date(promo.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Control Panel */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "grey.50",
            }}
          >
            {/* Status Toggle */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Visible:
              </Typography>
              <Switch
                size="small"
                checked={promo.isActive}
                onChange={(e) => onToggleActive(promo.id, e.target.checked)}
                color="primary"
              />
            </Box>

            {/* Reorder and Delete Actions */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    size="small"
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Move down">
                <span>
                  <IconButton
                    onClick={() => moveItem(index, "down")}
                    disabled={index === promos.length - 1}
                    size="small"
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Delete promo">
                <IconButton
                  onClick={() => onDelete(promo.id)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
export default PromoListSimple;
