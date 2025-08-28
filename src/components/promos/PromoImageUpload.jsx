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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { PhotoCamera, CloudUpload, OpenInNew } from "@mui/icons-material";
import { uploadImage, processImage } from "../../services/imageService";
import toast from "react-hot-toast";

const DEVICE_PREVIEW = {
  DESKTOP: { label: "Desktop", height: 200, width: 1200 },
  MOBILE: { label: "Mobile", height: 140, width: 400 },
  BOTH: { label: "Universal", height: 160, width: 800 },
};

const PromoImageUpload = ({
  onConfirm,
  canvaTemplateUrl = null,
  defaultDeviceType = "DESKTOP",
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [deviceType, setDeviceType] = useState(defaultDeviceType);

  const handleDeviceTypeChange = (event, newType) => {
    if (newType) setDeviceType(newType);
  };

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

      // Get preview dimensions for selected device type
      const { width, height } =
        DEVICE_PREVIEW[deviceType] || DEVICE_PREVIEW.DESKTOP;
      // Process image to correct aspect ratio
      const processedFile = await processImageToBanner(file, width, height);
      // Create preview
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview({
        url: previewUrl,
        file: processedFile,
        width,
        height,
      });
      setLoading(false);
      setConfirmDialog(true);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
      setLoading(false);
    }
  };

  const processImageToBanner = (
    file,
    bannerWidth = 1200,
    bannerHeight = 200
  ) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = bannerWidth;
        canvas.height = bannerHeight;
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

  const handleConfirm = async () => {
    if (!preview) return;

    try {
      setLoading(true);

      // Upload the processed image
      const uploadResult = await uploadImage(preview.file);

      // Extract just the URL string from the upload result
      const imageUrl = uploadResult.url;

      // Call the onConfirm callback with the image URL string and device type
      if (onConfirm) {
        await onConfirm(imageUrl, deviceType);
      }

      // Clean up
      URL.revokeObjectURL(preview.url);
      setPreview(null);
      setConfirmDialog(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Banner uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner");
    } finally {
      setLoading(false);
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ToggleButtonGroup
            value={deviceType}
            exclusive
            onChange={handleDeviceTypeChange}
            size="small"
            sx={{ mb: 1 }}
          >
            <ToggleButton value="DESKTOP">Desktop</ToggleButton>
            <ToggleButton value="MOBILE">Mobile</ToggleButton>
            <ToggleButton value="BOTH">Both</ToggleButton>
          </ToggleButtonGroup>
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
          {preview && (
            <Box>
              <Paper
                variant="outlined"
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  height: preview.height,
                  borderRadius: 1,
                }}
              >
                <img
                  src={preview.url}
                  alt={DEVICE_PREVIEW[deviceType].label + " preview"}
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
