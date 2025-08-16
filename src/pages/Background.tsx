import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

const BackgroundPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setProcessedImage(null); // Reset processed image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImageIfNeeded = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      return true;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);
    return false;
  };

  const removeBackground = async () => {
    if (!selectedImage || !imagePreview) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Starting background removal process...');
      
      // Load the image
      const img = new Image();
      img.onload = async () => {
        try {
          const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
            device: 'webgpu',
          });
          
          // Convert HTMLImageElement to canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) throw new Error('Could not get canvas context');
          
          // Resize image if needed and draw it to canvas
          const wasResized = resizeImageIfNeeded(canvas, ctx, img);
          console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
          
          // Get image data as base64
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          console.log('Image converted to base64');
          
          // Process the image with the segmentation model
          console.log('Processing with segmentation model...');
          const result = await segmenter(imageData);
          
          console.log('Segmentation result:', result);
          
          if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
            throw new Error('Invalid segmentation result');
          }
          
          // Create a new canvas for the masked image
          const outputCanvas = document.createElement('canvas');
          outputCanvas.width = canvas.width;
          outputCanvas.height = canvas.height;
          const outputCtx = outputCanvas.getContext('2d');
          
          if (!outputCtx) throw new Error('Could not get output canvas context');
          
          // Draw original image
          outputCtx.drawImage(canvas, 0, 0);
          
          // Apply the mask
          const outputImageData = outputCtx.getImageData(
            0, 0,
            outputCanvas.width,
            outputCanvas.height
          );
          const data = outputImageData.data;
          
          // Apply inverted mask to alpha channel
          for (let i = 0; i < result[0].mask.data.length; i++) {
            // Invert the mask value (1 - value) to keep the subject instead of the background
            const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
            data[i * 4 + 3] = alpha;
          }
          
          outputCtx.putImageData(outputImageData, 0, 0);
          console.log('Mask applied successfully');
          
          // Convert canvas to blob and create URL
          outputCanvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setProcessedImage(url);
              setIsProcessing(false);
              toast.success("Background removed successfully!");
            } else {
              throw new Error('Failed to create blob');
            }
          }, 'image/png', 1.0);
          
        } catch (error) {
          console.error('Error removing background:', error);
          setIsProcessing(false);
          toast.error("Failed to remove background. Please try again.");
        }
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        toast.error("Failed to load image");
      };
      
      img.src = imagePreview;
      
    } catch (error) {
      console.error('Error removing background:', error);
      setIsProcessing(false);
      toast.error("Failed to remove background. Please try again.");
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      link.click();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-background p-3 rounded-xl text-white">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Spek Background</h1>
                <p className="text-sm text-muted-foreground">AI-powered background removal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Remove Backgrounds Instantly</h2>
          <p className="text-xl text-muted-foreground">
            Upload any image and our AI will remove the background in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-background-tool transition-colors group"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-background-tool transition-colors" />
                <p className="text-lg font-medium mb-2">
                  {selectedImage ? selectedImage.name : "Drop your image here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imagePreview && (
                <div className="rounded-xl overflow-hidden border bg-white">
                  <img 
                    src={imagePreview} 
                    alt="Original" 
                    className="w-full h-64 object-contain"
                  />
                </div>
              )}

              <Button 
                onClick={removeBackground}
                disabled={!selectedImage || isProcessing}
                className="w-full bg-gradient-background hover:opacity-90 text-white border-0"
              >
                {isProcessing ? "Removing Background..." : "Remove Background"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Processed Image
                {processedImage && (
                  <Button
                    onClick={downloadImage}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processedImage ? (
                <div className="rounded-xl overflow-hidden border" style={{
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}>
                  <img 
                    src={processedImage} 
                    alt="Background removed" 
                    className="w-full h-64 object-contain"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload an image to see the result with background removed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="mt-12 shadow-tool">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-background p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any image with a subject you want to isolate
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-background p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">2. Process</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes and removes the background automatically
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-background p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">3. Download</h3>
                <p className="text-sm text-muted-foreground">
                  Download your image with transparent background
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackgroundPage;
