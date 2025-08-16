import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Type, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { analyzeFont, type GoogleFont } from "@/lib/fonts-database";

const Fonts = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fontResults, setFontResults] = useState<GoogleFont[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
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
    setFontResults([]);
    
    try {
      const results = await analyzeFont(selectedImage);
      setFontResults(results);
      toast.success(`Found ${results.length} font matches!`);
    } catch (error) {
      toast.error("Failed to analyze font. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async (text: string, fontFamily: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(fontFamily);
      toast.success("CSS import copied!");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
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
              {fontResults.length === 0 ? (
                <div className="text-center py-12">
                  <Type className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload an image to see font identification results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fontResults.map((font, index) => (
                    <div key={font.family} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{font.family}</h3>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              #{index + 1} Match
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{font.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="capitalize">{font.category}</span>
                            <span>{font.variants.length} weights</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Font Preview */}
                      <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                        <link href={font.downloadUrl} rel="stylesheet" />
                        <p 
                          className="text-2xl mb-2" 
                          style={{ fontFamily: `'${font.family}', ${font.category}` }}
                        >
                          The quick brown fox jumps over the lazy dog
                        </p>
                        <p 
                          className="text-lg text-muted-foreground" 
                          style={{ fontFamily: `'${font.family}', ${font.category}` }}
                        >
                          0123456789 !@#$%^&*()
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`@import url('${font.downloadUrl}');`, font.family)}
                          className="flex-1"
                        >
                          {copiedUrl === font.family ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy CSS
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={font.googleFontsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Google Fonts
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
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