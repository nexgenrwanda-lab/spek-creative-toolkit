// Free industry-level background removal using Hugging Face Inference API
const HF_API_URL = "https://api-inference.huggingface.co/models/schirrmacher/ormbg";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for free API
const MAX_DIMENSION = 2048;

interface HuggingFaceResponse {
  error?: string;
  estimated_time?: number;
}

// Compress and resize image for optimal API processing
const preprocessImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      // Resize if too large
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width *= scale;
        height *= scale;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            URL.revokeObjectURL(img.src);
            canvas.remove();
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        0.85
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const removeBackgroundHF = async (file: File): Promise<Blob> => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image too large. Please use an image smaller than 10MB.');
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }
  
  console.log('Starting Hugging Face background removal...');
  
  try {
    // Preprocess image for optimal results
    const processedImage = await preprocessImage(file);
    console.log('Image preprocessed for API');
    
    // Make API request
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      body: processedImage,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as HuggingFaceResponse;
      
      if (response.status === 503 && errorData.estimated_time) {
        throw new Error(`Model is loading. Please wait ${Math.ceil(errorData.estimated_time)} seconds and try again.`);
      }
      
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    const resultBlob = await response.blob();
    
    if (resultBlob.size === 0) {
      throw new Error('API returned empty result');
    }
    
    console.log('Background removal successful');
    return resultBlob;
    
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
};

export const loadImageFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};