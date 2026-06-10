/**
 * Cloudinary Feature Flag Wrapper
 *
 * Safely handles image uploads with or without Cloudinary configured.
 * When NEXT_PUBLIC_CLOUDINARY_ENABLED=false, returns mock/placeholder images.
 */

// Feature flag - check if Cloudinary is enabled
// Must use NEXT_PUBLIC_ prefix to be accessible on client side
export const CLOUDINARY_ENABLED = process.env.NEXT_PUBLIC_CLOUDINARY_ENABLED === "true";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Log warning if Cloudinary is disabled (only logs on client during hydration)
if (typeof window !== 'undefined' && !CLOUDINARY_ENABLED) {
  console.warn("Cloudinary is disabled - using mock images");
}

/**
 * Upload an image to Cloudinary or return a mock URL
 * @param file - The file to upload
 * @returns Promise with image URL and mock flag
 */
export async function uploadImage(file: File): Promise<{
  url: string;
  mock: boolean;
  error?: string;
}> {
  // If Cloudinary is disabled, return mock response
  if (!CLOUDINARY_ENABLED) {
    console.warn("Cloudinary is disabled - image upload skipped");
    return {
      url: `https://via.placeholder.com/300x300?text=Image+Upload+Disabled`,
      mock: true,
    };
  }

  // Validate Cloudinary configuration
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.error("Cloudinary configuration missing: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are required");
    return {
      url: `https://via.placeholder.com/300x300?text=Cloudinary+Not+Configured`,
      mock: true,
      error: "Cloudinary is not properly configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variables.",
    };
  }

  try {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      mock: false,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      url: `https://via.placeholder.com/300x300?text=Upload+Failed`,
      mock: true,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Generate a placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @param text - Text to display on placeholder
 * @returns Placeholder image URL
 */
export function getPlaceholderUrl(
  width: number = 300,
  height: number = 300,
  text?: string
): string {
  const placeholderText = text || "No Image";
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(placeholderText)}`;
}

/**
 * Check if image URL is a mock/placeholder
 * @param url - Image URL to check
 * @returns True if URL is a mock/placeholder
 */
export function isMockImage(url: string): boolean {
  if (!url) return true;
  return (
    url.includes("via.placeholder.com") ||
    url.includes("Cloudinary+Not+Configured") ||
    url.includes("Upload+Failed") ||
    url.includes("Image+Upload+Disabled")
  );
}
