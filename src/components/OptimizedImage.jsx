import { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage - Lazy loading image component with blur placeholder
 * 
 * Features:
 * - Lazy loading (only loads when in viewport)
 * - Blur placeholder while loading
 * - Error handling with fallback
 * - Automatic responsive images
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {string} fallback - Fallback image URL
 * @param {string} placeholder - Placeholder while loading (blur-up effect)
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/placeholder.jpg',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

/**
 * Usage Example:
 * 
 * import { OptimizedImage } from '@/components/OptimizedImage';
 * 
 * <OptimizedImage
 *   src="https://example.com/large-image.jpg"
 *   alt="Description"
 *   className="w-full h-64 object-cover"
 *   fallback="/fallback-image.jpg"
 * />
 */

export default OptimizedImage;
