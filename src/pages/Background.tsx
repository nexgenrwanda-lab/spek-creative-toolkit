import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Download, ImageIcon, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeBackground, loadImage, cleanupObjectURLs } from "@/lib/background-removal";

const BackgroundPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup function for privacy
  const clearAllImages = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
    setSelectedImage(null);
    cleanupObjectURLs();
    toast.success("All images cleared for privacy");
  };

  // Clean up on component unmount for privacy
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (processedImage) URL.revokeObjectURL(processedImage);
      cleanupObjectURLs();
    };
  }, [imagePreview, processedImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for privacy and performance)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      setProcessedImage(null); // Reset processed image
      
      // Clean up previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Load image using our secure utility
      const imageElement = await loadImage(selectedImage);
      
      // Remove background using our improved utility
      const resultBlob = await removeBackground(imageElement);
      
      // Clean up previous processed image
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
      
      // Create new object URL for result
      const resultURL = URL.createObjectURL(resultBlob);
      setProcessedImage(resultURL);
      
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error("Failed to remove background. Please try a different image or try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
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
              <div className="p-3 rounded-xl">
                <img 
                  src="/lovable-uploads/86b13327-ef02-4439-b170-7065c6658c81.png" 
                  alt="Spek Background" 
                  className="h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Spek Background</h1>
                <p className="text-sm text-muted-foreground">AI-powered background removal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Privacy Notice */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>🔒 Your images are processed locally in your browser - nothing is uploaded or stored</span>
            </div>
            {(imagePreview || processedImage) && (
              <Button
                onClick={clearAllImages}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Remove Backgrounds Instantly</h2>
          <p className="text-xl text-muted-foreground">
            Upload any image and our AI will remove the background in seconds - all processing happens in your browser
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
                  or click to browse files (max 10MB)
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
                onClick={handleRemoveBackground}
                disabled={!selectedImage || isProcessing}
                className="w-full hover:opacity-90 text-white border-0"
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
                    Download PNG
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

        {/* Privacy & How it Works */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Privacy Features */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Local Processing</p>
                    <p className="text-sm text-muted-foreground">All image processing happens in your browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">No Data Storage</p>
                    <p className="text-sm text-muted-foreground">Images are never uploaded or stored on our servers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Automatic Cleanup</p>
                    <p className="text-sm text-muted-foreground">All temporary data is automatically cleared</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">1. Upload</p>
                    <p className="text-sm text-muted-foreground">Select an image from your device</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">2. AI Processing</p>
                    <p className="text-sm text-muted-foreground">Advanced AI identifies and removes background</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">3. Download</p>
                    <p className="text-sm text-muted-foreground">Get your image with transparent background</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPage;