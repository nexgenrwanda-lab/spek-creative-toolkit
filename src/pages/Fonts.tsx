import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Type } from "lucide-react";
import { toast } from "sonner";

const Fonts = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate font analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Font analysis coming soon! This feature will identify fonts and suggest Google Fonts alternatives.");
    }, 2000);
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
              <div className="bg-gradient-fonts p-3 rounded-xl text-white">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Spek Fonts</h1>
                <p className="text-sm text-muted-foreground">Font identification tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Identify Any Font</h2>
          <p className="text-xl text-muted-foreground">
            Upload an image with text and we'll identify the font for you
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
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-fonts transition-colors group"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-fonts transition-colors" />
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
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="w-full bg-gradient-fonts hover:opacity-90 text-white border-0"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Font"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-tool">
            <CardHeader>
              <CardTitle>Font Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Type className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Upload an image to see font identification results
                </p>
              </div>
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
                <div className="bg-gradient-fonts p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any image containing text
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-fonts p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Type className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">2. Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes the text and identifies fonts
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-fonts p-4 rounded-xl w-fit mx-auto mb-4 text-white">
                  <Type className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">3. Match</h3>
                <p className="text-sm text-muted-foreground">
                  Get Google Fonts alternatives and download links
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fonts;