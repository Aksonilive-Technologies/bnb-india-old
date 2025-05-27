"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { MdOutlineImageNotSupported } from "react-icons/md";

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string;
  containerClassName?: string;
  showLoadingState?: boolean;
}

/**
 * OptimizedImage - A wrapper around Next.js Image component with:
 * - Proper loading states
 * - Fallback for broken images
 * - Automatic priority for above-the-fold images
 * - Responsive sizing
 * - Consistent error handling
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  containerClassName,
  showLoadingState = false,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', // Default responsive sizes
  loading = 'lazy',
  quality = 85, // Default quality setting
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(showLoadingState);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(showLoadingState);
    setError(false);
    setImageSrc(src);
  }, [src, showLoadingState]);

  // Handle image loading and errors
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Display different elements based on loading/error states
  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100", 
        fallbackClassName || "w-full h-full"
      )}>
        <MdOutlineImageNotSupported size={50} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "transition-opacity duration-300", 
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        priority={priority}
        sizes={sizes}
        loading={loading}
        quality={quality}
        {...props}
      />
    </div>
  );
}
