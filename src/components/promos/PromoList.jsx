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
} from "@mui/material";
import {
  Delete,
  DragIndicator,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const PromoList = ({
  promos = [],
  onReorder,
  onDelete,
  onToggleActive,
  loading = false,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = (result) => {
    setDragging(false);

    if (!result.destination) {
      return;
    }

    const items = Array.from(promos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const handleDragStart = () => {
    setDragging(true);
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
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId="promos">
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              minHeight: 100,
              backgroundColor: snapshot.isDraggingOver
                ? "action.hover"
                : "transparent",
              borderRadius: 1,
              transition: "background-color 0.2s ease",
            }}
          >
            {promos.map((promo, index) => (
              <Draggable
                key={promo.id}
                draggableId={promo.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      mb: 2,
                      display: "flex",
                      transform: snapshot.isDragging
                        ? "rotate(5deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      opacity: snapshot.isDragging ? 0.8 : 1,
                      boxShadow: snapshot.isDragging ? 4 : 1,
                      border: dragging ? "2px dashed #1976d2" : "none",
                    }}
                  >
                    {/* Drag Handle */}
                    <Box
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1,
                        cursor: "grab",
                        backgroundColor: "grey.100",
                        "&:active": {
                          cursor: "grabbing",
                        },
                      }}
                    >
                      <DragIndicator color="action" />
                    </Box>

                    {/* Image Preview */}
                    <CardMedia
                      component="img"
                      sx={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                      }}
                      image={promo.imageUrl}
                      alt={`Promo ${index + 1}`}
                    />

                    {/* Content */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Promo Image #{promo.order || index + 1}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created:{" "}
                            {new Date(promo.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
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

                      {/* Actions */}
                      <CardActions
                        sx={{ p: 0, justifyContent: "space-between" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            Visible:
                          </Typography>
                          <Switch
                            size="small"
                            checked={promo.isActive}
                            onChange={(e) =>
                              onToggleActive(promo.id, e.target.checked)
                            }
                            color="primary"
                          />
                        </Box>

                        <Tooltip title="Delete promo">
                          <IconButton
                            onClick={() => onDelete(promo.id)}
                            color="error"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Box>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PromoList;
