import React, { useState, useRef, useEffect } from 'react';
import { getAssetThumbnail, getAssetMediumImage, getAssetFullImage, getAssetBlurredPlaceholder } from '../../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'thumbnail' | 'medium' | 'full';
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  size = 'medium',
  width,
  height,
  lazy = true,
  placeholder = true,
  onClick,
  style
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Get optimized image URL based on size
  const getImageUrl = () => {
    if (!src) return '';
    
    switch (size) {
      case 'thumbnail':
        return getAssetThumbnail(src, width || 300);
      case 'medium':
        return getAssetMediumImage(src, width || 800);
      case 'full':
        return getAssetFullImage(src, width || 1200);
      default:
        return src;
    }
  };

  // Get placeholder URL
  const getPlaceholderUrl = () => {
    if (!placeholder) return '';
    return getAssetBlurredPlaceholder(src);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageUrl = isInView ? getImageUrl() : '';
  const placeholderUrl = getPlaceholderUrl();

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        onClick={onClick}
      >
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, ...style }}
      onClick={onClick}
    >
      {/* Blurred placeholder */}
      {placeholder && placeholderUrl && !isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          style={{ transform: 'scale(1.1)' }}
        />
      )}
      
      {/* Main image */}
      {isInView && imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Loading spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
