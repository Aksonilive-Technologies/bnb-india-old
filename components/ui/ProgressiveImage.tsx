"use client";

import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  lowQualitySrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

/**
 * ProgressiveImage - Shows a low quality image while the high quality image loads
 * This creates a better perceived performance, especially on slower connections
 */
export default function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  quality = 85,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: ProgressiveImageProps) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  
  // If no lowQualitySrc is provided, generate a simple blur placeholder
  const blurPlaceholder = lowQualitySrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
  
  // Reset loading state when src changes
  useEffect(() => {
    setIsHighResLoaded(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Low quality image or blur placeholder */}
      {!isHighResLoaded && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={blurPlaceholder}
            alt={alt}
            width={width}
            height={height}
            className={cn("w-full h-full object-cover blur-sm scale-105", className)}
            priority={true}
            quality={10}
          />
        </div>
      )}
      
      {/* High quality image */}
      <div 
        className={cn(
          "transition-opacity duration-500", 
          isHighResLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("w-full h-full object-cover", className)}
          onLoad={() => setIsHighResLoaded(true)}
          priority={priority}
          quality={quality}
          sizes={sizes}
        />
      </div>
    </div>
  );
}
