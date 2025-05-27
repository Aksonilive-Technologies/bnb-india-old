import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { compressImage, createImagePlaceholder, getOptimalQuality } from "./imageCompression";

interface UploadProgressCallback {
  (progress: number): void;
}

interface UploadResult {
  downloadUrl: string;
  placeholderUrl?: string;
  originalName: string;
  size: number;
  contentType: string;
  storagePath: string;
}

/**
 * Uploads an image to Firebase Storage with automatic compression
 * @param file - The image file to upload
 * @param path - Storage path (e.g., 'properties/villa123/')
 * @param generatePlaceholder - Whether to generate a low-quality placeholder
 * @param progressCallback - Optional callback for upload progress
 * @returns Promise with upload result
 */
export async function uploadImage(
  file: File,
  path: string,
  generatePlaceholder: boolean = false,
  progressCallback?: UploadProgressCallback
): Promise<UploadResult> {
  try {
    // Determine optimal quality based on file size
    const quality = getOptimalQuality(file.size);
    
    // Compress image before uploading
    const compressedFile = await compressImage(file, {
      initialQuality: quality,
      maxWidthOrHeight: 1920, // Limit max dimension to 1920px
      maxSizeMB: 2, // Limit to 2MB max
    });
    
    // Generate a low-quality placeholder if requested
    let placeholderUrl: string | undefined;
    if (generatePlaceholder) {
      placeholderUrl = await createImagePlaceholder(compressedFile);
    }
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
    const fullPath = `${path}/${filename}`;
    
    // Upload to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, fullPath);
    
    // Start upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        // Progress callback
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback(progress);
          }
        },
        // Error callback
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        // Success callback
        async () => {
          // Get download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          resolve({
            downloadUrl,
            placeholderUrl,
            originalName: compressedFile.name,
            size: compressedFile.size,
            contentType: compressedFile.type,
            storagePath: fullPath,
          });
        }
      );
    });
  } catch (error) {
    console.error('Error in image upload process:', error);
    throw error;
  }
}

/**
 * Uploads multiple images in parallel with compression
 * @param files - Array of image files to upload
 * @param path - Base storage path
 * @param generatePlaceholders - Whether to generate low-quality placeholders
 * @param progressCallback - Optional overall progress callback
 * @returns Promise with array of upload results
 */
export async function uploadMultipleImages(
  files: File[],
  path: string,
  generatePlaceholders: boolean = false,
  progressCallback?: UploadProgressCallback
): Promise<UploadResult[]> {
  try {
    // Track total progress across all uploads
    let totalProgress = 0;
    
    // Individual progress trackers for each file
    const trackProgress = (index: number, progress: number) => {
      // Calculate contribution to total progress (each file contributes equally)
      const contribution = progress / files.length;
      
      // Update the total progress
      totalProgress = Math.min(
        100,
        totalProgress + (contribution - (totalProgress / files.length))
      );
      
      // Report overall progress if callback provided
      if (progressCallback) {
        progressCallback(totalProgress);
      }
    };
    
    // Upload all files in parallel
    const uploadPromises = files.map((file, index) => 
      uploadImage(
        file, 
        path, 
        generatePlaceholders,
        (progress) => trackProgress(index, progress)
      )
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}
