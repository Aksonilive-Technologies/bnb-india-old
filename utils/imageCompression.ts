import imageCompression from 'browser-image-compression';

export interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  initialQuality?: number;
}

/**
 * Compresses an image file before uploading
 * @param imageFile - The original image file
 * @param options - Compression options
 * @returns A promise with the compressed image file
 */
export async function compressImage(
  imageFile: File, 
  options: ImageCompressionOptions = {}
): Promise<File> {
  try {
    // Default options
    const defaultOptions = {
      maxSizeMB: 1, // Default max size of 1MB
      maxWidthOrHeight: 1920, // Default max width/height
      useWebWorker: true, // Use web worker for better performance
      fileType: 'image/jpeg', // Default output format
      initialQuality: 0.8, // Initial quality setting (0-1)
    };

    // Merge default options with provided options
    const compressionOptions = { ...defaultOptions, ...options };

    // Skip compression for small images (less than 200KB)
    if (imageFile.size < 200 * 1024) {
      return imageFile;
    }

    // Compress image
    const compressedFile = await imageCompression(imageFile, compressionOptions);
    
    // If compression doesn't reduce size significantly, return original
    if (compressedFile.size > imageFile.size * 0.9) {
      return imageFile;
    }

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return imageFile;
  }
}

/**
 * Compresses multiple images in parallel
 * @param imageFiles - Array of image files to compress
 * @param options - Compression options
 * @returns Promise with array of compressed image files
 */
export async function compressMultipleImages(
  imageFiles: File[],
  options: ImageCompressionOptions = {}
): Promise<File[]> {
  try {
    // Process all images in parallel for better performance
    const compressionPromises = imageFiles.map(file => compressImage(file, options));
    return await Promise.all(compressionPromises);
  } catch (error) {
    console.error('Error compressing multiple images:', error);
    // Return original files if compression fails
    return imageFiles;
  }
}

/**
 * Creates a low-quality image placeholder (LQIP) from an image
 * @param imageFile - Original image file
 * @returns Promise with data URL of the LQIP
 */
export async function createImagePlaceholder(imageFile: File): Promise<string> {
  try {
    // Create a tiny version of the image for placeholder
    const placeholderOptions = {
      maxSizeMB: 0.01, // Very small size (10KB)
      maxWidthOrHeight: 64, // Tiny dimensions
      initialQuality: 0.3, // Lower quality
    };
    
    const placeholderFile = await compressImage(imageFile, placeholderOptions);
    
    // Convert to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(placeholderFile);
    });
  } catch (error) {
    console.error('Error creating image placeholder:', error);
    return '';
  }
}

/**
 * Determines the appropriate quality setting based on image size
 * @param fileSize - File size in bytes
 * @returns Appropriate quality setting (0-1)
 */
export function getOptimalQuality(fileSize: number): number {
  // Apply progressive quality reduction based on file size
  if (fileSize > 5 * 1024 * 1024) return 0.6;      // > 5MB
  if (fileSize > 2 * 1024 * 1024) return 0.7;      // 2-5MB
  if (fileSize > 1 * 1024 * 1024) return 0.8;      // 1-2MB
  return 0.9;                                       // < 1MB
}
