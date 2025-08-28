import { supabase } from "../config/supabase";

/**
 * Upload an image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} bucket - The storage bucket name (e.g., 'products', 'grains')
 * @param {string} folder - The folder within the bucket (optional)
 * @returns {Promise<{url: string, path: string} | null>}
 */
export const uploadImage = async (
  file,
  bucket = "promos",
  folder = "promo-images"
) => {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Delete an image from Supabase storage
 * @param {string} path - The file path in storage
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (path, bucket = "images") => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};

/**
 * Compress and resize image to square format
 * @param {File} file - The image file to process
 * @param {number} size - The desired square size (default: 400px)
 * @param {number} quality - The compression quality (0-1, default: 0.8)
 * @returns {Promise<File>}
 */
export const processImage = (file, size = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas to square dimensions
      canvas.width = size;
      canvas.height = size;

      // Calculate crop dimensions to make it square
      const minDimension = Math.min(img.width, img.height);
      const cropX = (img.width - minDimension) / 2;
      const cropY = (img.height - minDimension) / 2;

      // Draw cropped and resized image
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minDimension,
        minDimension,
        0,
        0,
        size,
        size
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
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};
