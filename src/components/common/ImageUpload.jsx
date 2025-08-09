import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { PhotoCamera, Delete, CloudUpload } from "@mui/icons-material";
import {
  uploadImage,
  processImage,
  deleteImage,
} from "../../services/imageService";
import toast from "react-hot-toast";

const ImageUpload = ({
  value,
  onChange,
  bucket = "images",
  folder = "",
  size = 400,
  label = "Upload Image",
  required = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Process image to square format
      const processedFile = await processImage(file, size, 0.8);

      // Create preview
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview(previewUrl);

      // Upload to Supabase
      const result = await uploadImage(processedFile, bucket, folder);

      if (result) {
        onChange(result.url);
        setPreview(result.url);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      setPreview("");
      onChange("");
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);

      // If there's an existing image URL, try to delete it from storage
      if (value && value.includes("supabase")) {
        const pathMatch = value.match(
          /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/
        );
        if (pathMatch) {
          await deleteImage(pathMatch[1], bucket);
        }
      }

      // Clear preview and value
      setPreview("");
      onChange("");
      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label} {required && "*"}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          textAlign: "center",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: preview ? "transparent" : "grey.50",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {preview ? (
          <Box sx={{ position: "relative", width: "100%", maxWidth: 200 }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
              }}
            />
            <IconButton
              onClick={handleRemove}
              disabled={loading}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "error.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
                width: 32,
                height: 32,
              }}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Click to upload a square image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max file size: 5MB • Formats: JPG, PNG, WEBP
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant={preview ? "outlined" : "contained"}
            startIcon={<PhotoCamera />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            size="small"
          >
            {preview ? "Change Image" : "Select Image"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageUpload;
