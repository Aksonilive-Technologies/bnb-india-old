"use client";

import { useRef, useEffect, useState } from 'react';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
  quality?: number;
  rootMargin?: string;
  threshold?: number;
  sizes?: string;
}

/**
 * LazyImage - Only loads images when they enter the viewport
 * This reduces initial page load and saves bandwidth
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  quality = 85,
  rootMargin = '200px 0px', // Load images 200px before they enter viewport
  threshold = 0.1, // Start loading when 10% of the image is visible
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ width, height }}
    >
      {/* Placeholder before image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {/* Only render image when in viewport */}
      {isIntersecting && (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300", 
            isLoaded ? "opacity-100" : "opacity-0", 
            className
          )}
          onLoad={() => setIsLoaded(true)}
          priority={false}
          loading="lazy"
          quality={quality}
          sizes={sizes}
        />
      )}
    </div>
  );
}
