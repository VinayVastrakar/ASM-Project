// Image optimization utilities for Cloudinary
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export interface ImageTransformationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  crop?: 'scale' | 'fit' | 'fill' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  radius?: number;
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export class CloudinaryImageOptimizer {
  private baseUrl: string;

  constructor(cloudName: string) {
    this.baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  }

  /**
   * Generate optimized image URL for different use cases
   */
  getOptimizedImageUrl(
    publicId: string, 
    options: ImageTransformationOptions = {}
  ): string {
    const transformations = this.buildTransformationString(options);
    return `${this.baseUrl}/${transformations}/${publicId}`;
  }

  /**
   * Get thumbnail image URL (for lists, cards)
   */
  getThumbnailUrl(publicId: string, size: number = CLOUDINARY_CONFIG.optimization.thumbnail.width): string {
    return this.getOptimizedImageUrl(publicId, {
      width: size,
      height: size,
      crop: CLOUDINARY_CONFIG.optimization.thumbnail.crop,
      quality: CLOUDINARY_CONFIG.optimization.thumbnail.quality,
      format: CLOUDINARY_CONFIG.optimization.format,
      gravity: CLOUDINARY_CONFIG.optimization.thumbnail.gravity
    });
  }

  /**
   * Get medium-sized image URL (for detail views)
   */
  getMediumUrl(publicId: string, maxWidth: number = CLOUDINARY_CONFIG.optimization.medium.width): string {
    return this.getOptimizedImageUrl(publicId, {
      width: maxWidth,
      crop: CLOUDINARY_CONFIG.optimization.medium.crop,
      quality: CLOUDINARY_CONFIG.optimization.medium.quality,
      format: CLOUDINARY_CONFIG.optimization.format
    });
  }

  /**
   * Get full-size image URL (for modal/lightbox)
   */
  getFullSizeUrl(publicId: string, maxWidth: number = CLOUDINARY_CONFIG.optimization.full.width): string {
    return this.getOptimizedImageUrl(publicId, {
      width: maxWidth,
      crop: CLOUDINARY_CONFIG.optimization.full.crop,
      quality: CLOUDINARY_CONFIG.optimization.full.quality,
      format: CLOUDINARY_CONFIG.optimization.format
    });
  }

  /**
   * Get blurred placeholder URL (for lazy loading)
   */
  getBlurredPlaceholderUrl(publicId: string, size: number = CLOUDINARY_CONFIG.optimization.placeholder.width): string {
    return this.getOptimizedImageUrl(publicId, {
      width: size,
      height: size,
      crop: CLOUDINARY_CONFIG.optimization.placeholder.crop,
      quality: CLOUDINARY_CONFIG.optimization.placeholder.quality,
      blur: CLOUDINARY_CONFIG.optimization.placeholder.blur,
      format: CLOUDINARY_CONFIG.optimization.format
    });
  }

  /**
   * Build transformation string from options
   */
  private buildTransformationString(options: ImageTransformationOptions): string {
    const transformations: string[] = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.gravity) transformations.push(`g_${options.gravity}`);
    if (options.radius) transformations.push(`r_${options.radius}`);
    if (options.blur) transformations.push(`e_blur:${options.blur}`);
    if (options.brightness) transformations.push(`e_brightness:${options.brightness}`);
    if (options.contrast) transformations.push(`e_contrast:${options.contrast}`);
    if (options.saturation) transformations.push(`e_saturation:${options.saturation}`);

    return transformations.join(',');
  }
}

// Default instance - configured with your Cloudinary cloud name
export const imageOptimizer = new CloudinaryImageOptimizer(CLOUDINARY_CONFIG.cloudName);

// Utility functions for common use cases
export const getAssetThumbnail = (imageUrl: string, size: number = 300): string => {
  if (!imageUrl) return '';
  
  // If it's already a full Cloudinary URL, add transformations
  if (imageUrl.includes('cloudinary.com')) {
    return buildCloudinaryUrl(imageUrl, 'thumbnail', size);
  }
  
  // Extract public ID from Cloudinary URL
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return imageUrl;
  
  return imageOptimizer.getThumbnailUrl(publicId, size);
};

export const getAssetMediumImage = (imageUrl: string, maxWidth: number = 800): string => {
  if (!imageUrl) return '';
  
  // If it's already a full Cloudinary URL, add transformations
  if (imageUrl.includes('cloudinary.com')) {
    return buildCloudinaryUrl(imageUrl, 'medium', maxWidth);
  }
  
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return imageUrl;
  
  return imageOptimizer.getMediumUrl(publicId, maxWidth);
};

export const getAssetFullImage = (imageUrl: string, maxWidth: number = 1200): string => {
  if (!imageUrl) return '';
  
  // If it's already a full Cloudinary URL, add transformations
  if (imageUrl.includes('cloudinary.com')) {
    return buildCloudinaryUrl(imageUrl, 'full', maxWidth);
  }
  
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return imageUrl;
  
  return imageOptimizer.getFullSizeUrl(publicId, maxWidth);
};

export const getAssetBlurredPlaceholder = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already a full Cloudinary URL, add transformations
  if (imageUrl.includes('cloudinary.com')) {
    return buildCloudinaryUrl(imageUrl, 'placeholder');
  }
  
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return '';
  
  return imageOptimizer.getBlurredPlaceholderUrl(publicId);
};

/**
 * Debug function to test URL construction
 */
export const debugCloudinaryUrl = (imageUrl: string, size: 'thumbnail' | 'medium' | 'full' = 'medium'): void => {
  console.log('=== Cloudinary URL Debug ===');
  console.log('Original URL:', imageUrl);
  console.log('Size:', size);
  
  if (imageUrl.includes('cloudinary.com')) {
    const optimizedUrl = buildCloudinaryUrl(imageUrl, size);
    console.log('Optimized URL:', optimizedUrl);
    console.log('✅ Using full URL optimization');
  } else {
    const publicId = extractPublicIdFromUrl(imageUrl);
    console.log('Extracted Public ID:', publicId);
    if (publicId) {
      const optimizedUrl = imageOptimizer.getMediumUrl(publicId);
      console.log('Optimized URL:', optimizedUrl);
      console.log('✅ Using public ID optimization');
    } else {
      console.log('❌ Could not extract public ID');
    }
  }
  console.log('========================');
};

/**
 * Build optimized Cloudinary URL from existing full URL
 */
function buildCloudinaryUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'full' | 'placeholder', customSize?: number): string {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return imageUrl;
  
  // Split the URL to get the base and the part after /upload/
  const parts = imageUrl.split('/upload/');
  if (parts.length !== 2) return imageUrl;
  
  const baseUrl = parts[0]; // "https://res.cloudinary.com/dnhrxf0au/image"
  const afterUpload = parts[1]; // "v1759060495/asset-management-system/asset_image/rejmdrdqpf8elpcshn82.jpg"
  
  // Define transformations based on size
  const transformations = {
    thumbnail: `w_${customSize || CLOUDINARY_CONFIG.optimization.thumbnail.width},h_${customSize || CLOUDINARY_CONFIG.optimization.thumbnail.height},c_${CLOUDINARY_CONFIG.optimization.thumbnail.crop},q_${CLOUDINARY_CONFIG.optimization.thumbnail.quality},f_${CLOUDINARY_CONFIG.optimization.format},g_${CLOUDINARY_CONFIG.optimization.thumbnail.gravity}`,
    medium: `w_${customSize || CLOUDINARY_CONFIG.optimization.medium.width},c_${CLOUDINARY_CONFIG.optimization.medium.crop},q_${CLOUDINARY_CONFIG.optimization.medium.quality},f_${CLOUDINARY_CONFIG.optimization.format}`,
    full: `w_${customSize || CLOUDINARY_CONFIG.optimization.full.width},c_${CLOUDINARY_CONFIG.optimization.full.crop},q_${CLOUDINARY_CONFIG.optimization.full.quality},f_${CLOUDINARY_CONFIG.optimization.format}`,
    placeholder: `w_${CLOUDINARY_CONFIG.optimization.placeholder.width},h_${CLOUDINARY_CONFIG.optimization.placeholder.height},c_${CLOUDINARY_CONFIG.optimization.placeholder.crop},q_${CLOUDINARY_CONFIG.optimization.placeholder.quality},e_blur:${CLOUDINARY_CONFIG.optimization.placeholder.blur},f_${CLOUDINARY_CONFIG.optimization.format}`
  };
  
  const transformation = transformations[size];
  
  // Rebuild URL with transformations: baseUrl/upload/transformation/afterUpload
  return `${baseUrl}/upload/${transformation}/${afterUpload}`;
}

/**
 * Extract public ID from Cloudinary URL
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Handle different Cloudinary URL formats
    const patterns = [
      /\/image\/upload\/[^/]+\/(.+)$/,  // With transformations
      /\/image\/upload\/(.+)$/,          // Without transformations
      /\/v\d+\/(.+)$/                   // Versioned URLs
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1].replace(/\.[^.]*$/, ''); // Remove file extension
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}
