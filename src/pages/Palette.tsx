import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Palette, Copy } from "lucide-react";
import { toast } from "sonner";

const PalettePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setColors([]); // Reset colors
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = async () => {
    if (!selectedImage || !imagePreview) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    
    // Create a canvas to analyze the image
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setIsAnalyzing(false);
        return;
      }

      // Resize image for faster processing
      const maxSize = 100;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Extract colors (simplified approach)
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        
        if (alpha > 128) { // Skip transparent pixels
          const hex = rgbToHex(r, g, b);
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
      }
      
      // Get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([color]) => color);
      
      setColors(sortedColors);
      setIsAnalyzing(false);
      toast.success("Color palette extracted successfully!");
    };
    
    img.src = imagePreview;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
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
              <div className="bg-gradient-palette p-3 rounded-xl text-white">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Spek Palette</h1>
                <p className="text-sm text-muted-foreground">Color palette extraction tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Extract Color Palettes</h2>
          <p className="text-xl text-muted-foreground">
            Upload any image and get a beautiful color palette from it
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-palette transition-colors group"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-palette transition-colors" />
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
                <div className="rounded-xl overflow-hidden border">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <Button 
                onClick={extractColors}
                disabled={!selectedImage || isAnalyzing}
                className="w-full bg-gradient-palette hover:opacity-90 text-white border-0"
              >
                {isAnalyzing ? "Extracting Colors..." : "Extract Palette"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              {colors.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                        title={`Click to copy ${color}`}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-md border" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-sm">{color}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyColor(color)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload an image to extract its color palette
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
                <div className="bg-gradient-palette p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any image - photos, designs, artwork
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-palette p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">2. Extract</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes colors and creates a harmonious palette
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-palette p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Copy className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">3. Copy</h3>
                <p className="text-sm text-muted-foreground">
                  Click any color to copy hex codes instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PalettePage;