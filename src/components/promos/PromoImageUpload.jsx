import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Link,
  Divider,
} from "@mui/material";
import { PhotoCamera, CloudUpload, OpenInNew } from "@mui/icons-material";
import { uploadImage, processImage } from "../../services/imageService";
import toast from "react-hot-toast";

const PromoImageUpload = ({ onConfirm, canvaTemplateUrl = null }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setLoading(true);

      // Process image to banner format (6:1 aspect ratio)
      const processedFile = await processImageToBanner(file);

      // Create preview
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview({
        url: previewUrl,
        file: processedFile,
      });

      setLoading(false);
      setConfirmDialog(true);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
      setLoading(false);
    }
  };

  const processImageToBanner = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas to banner dimensions (6:1 ratio)
        const bannerWidth = 1200;
        const bannerHeight = 200;
        canvas.width = bannerWidth;
        canvas.height = bannerHeight;

        // Calculate how to crop the image to fit banner ratio
        const imgAspectRatio = img.width / img.height;
        const bannerAspectRatio = bannerWidth / bannerHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (imgAspectRatio > bannerAspectRatio) {
          // Image is wider than banner ratio - crop width
          sourceWidth = img.height * bannerAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than banner ratio - crop height
          sourceHeight = img.width / bannerAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        // Draw cropped and resized image
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          bannerWidth,
          bannerHeight
        );

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
              reject(new Error("Failed to process image"));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleConfirm = async () => {
    if (!preview?.file) return;

    try {
      setLoading(true);

      // Upload to Supabase
      const result = await uploadImage(preview.file, "promos", "promo-images");

      if (result) {
        setPendingImageUrl(result.url);
        onConfirm(result.url);
        toast.success("Image uploaded successfully");

        // Reset form
        setPreview(null);
        setConfirmDialog(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    setConfirmDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          textAlign: "center",
          backgroundColor: "grey.50",
          border: "2px dashed",
          borderColor: "grey.300",
          cursor: "pointer",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "grey.100",
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={24} />
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              Processing...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            <CloudUpload sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Upload Promo Banner
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              JPG, PNG, WebP • Max 5MB • 6:1 ratio recommended
            </Typography>

            {canvaTemplateUrl && (
              <>
                <Divider sx={{ my: 1, mx: -2 }} />
                <Link
                  href={canvaTemplateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Use Canva Template <OpenInNew sx={{ fontSize: 12 }} />
                </Link>
              </>
            )}
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={handleCancel}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Confirm Promo Banner Upload
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={handleCancel} disabled={loading} size="small">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={loading || !preview}
                startIcon={
                  loading ? <CircularProgress size={16} /> : <PhotoCamera />
                }
                size="small"
              >
                {loading ? "Uploading..." : "Confirm & Upload"}
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Preview how your banner will appear on different devices:
          </Typography>

          {preview && (
            <Box>
              {/* Desktop Preview */}
              <Typography variant="subtitle2" gutterBottom>
                Desktop Preview (200px height)
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  mb: 3,
                  overflow: "hidden",
                  height: 200,
                  borderRadius: 1,
                }}
              >
                <img
                  src={preview.url}
                  alt="Desktop preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Paper>

              {/* Mobile Preview */}
              <Typography variant="subtitle2" gutterBottom>
                Mobile Preview (140px height)
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  height: 140,
                  borderRadius: 1,
                }}
              >
                <img
                  src={preview.url}
                  alt="Mobile preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Paper>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  The image has been automatically cropped and optimized for
                  banner display. Important content should be in the center 80%
                  of the image.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PromoImageUpload;
