// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dnhrxf0au', // Replace with your actual cloud name
  apiKey: '874351794643963', // Replace with your actual API key
  apiSecret: 'jqaHQ4DJyc59GZizMU42pQJFiX4', // Replace with your actual API secret
  
  // Image optimization settings
  optimization: {
    enabled: true,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 'auto' as const,
    format: 'auto' as const,
    
    // Thumbnail settings
    thumbnail: {
      width: 300,
      height: 300,
      crop: 'fill' as const,
      quality: 'auto' as const,
      gravity: 'auto' as const
    },
    
    // Medium image settings
    medium: {
      width: 800,
      height: 800,
      crop: 'scale' as const,
      quality: 'auto' as const
    },
    
    // Full size settings
    full: {
      width: 1200,
      height: 1200,
      crop: 'scale' as const,
      quality: 'best' as const
    },
    
    // Placeholder settings
    placeholder: {
      width: 50,
      height: 50,
      crop: 'fill' as const,
      quality: 'low' as const,
      blur: 1000
    }
  },
  
  // Upload settings
  upload: {
    folder: 'asset-management-system',
    resourceType: 'image',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    transformation: {
      quality: 'auto' as const,
      format: 'auto' as const
    }
  }
};

// Environment-based configuration
export const getCloudinaryConfig = () => {
  return {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || CLOUDINARY_CONFIG.cloudName,
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || CLOUDINARY_CONFIG.apiKey,
    apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || CLOUDINARY_CONFIG.apiSecret,
    ...CLOUDINARY_CONFIG
  };
};
