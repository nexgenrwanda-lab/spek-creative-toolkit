import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Download } from "lucide-react";

const Index = () => {
  const tools = [
    {
      id: "fonts",
      title: "Spek Fonts",
      description: "Identify fonts from images and connect to Google Fonts",
      icon: <img src="/lovable-uploads/d40d976e-6549-4f0a-802f-33df507d4a5b.png" alt="Spek Fonts" className="h-8 object-contain" />,
      color: "fonts",
      gradient: "bg-gradient-fonts",
      link: "/fonts"
    },
    {
      id: "palette",
      title: "Spek Palette",
      description: "Extract color palettes from any image",
      icon: <img src="/lovable-uploads/19345d9e-16c9-43f6-a0b2-0f512ca29982.png" alt="Spek Palette" className="w-8 h-8" />,
      color: "palette",
      gradient: "bg-gradient-palette",
      link: "/palette"
    },
    {
      id: "background",
      title: "Spek Background",
      description: "Remove backgrounds from images instantly",
      icon: <img src="/lovable-uploads/86b13327-ef02-4439-b170-7065c6658c81.png" alt="Spek Background" className="h-8 object-contain" />,
      color: "background-tool",
      gradient: "bg-gradient-background",
      link: "/background"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <img 
                src="/lovable-uploads/5e0033bc-f334-4b8c-a108-6c953cefa845.png" 
                alt="Spek Tools Logo" 
                className="h-12"
              />
              <p className="text-muted-foreground mt-2">Professional design tools for creators</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#extension" className="scroll-smooth">
                  Extension
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Design Tools Made
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Upload, analyze, and transform your images with our suite of professional design tools. 
            From font identification to background removal.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Card key={tool.id} className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border-0 shadow-tool">
                <CardContent className="p-8">
                  <div className="p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    {tool.id === 'palette' ? (
                      <img src="/lovable-uploads/19345d9e-16c9-43f6-a0b2-0f512ca29982.png" alt="Spek Palette" className="h-16 object-contain -mt-1" />
                    ) : (
                      tool.icon
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{tool.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  <Link to={tool.link}>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      Try {tool.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plugin Section */}
      <section id="extension" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Download className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Chrome Extension</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant access to all Spek Tools directly from your browser. 
            No need to visit the website every time.
          </p>
          
          <Card className="max-w-2xl mx-auto mb-8 text-left">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Quick Installation:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="font-medium text-foreground mr-2">1.</span>
                  Download the extension files below
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-foreground mr-2">2.</span>
                  Open Chrome and go to <code className="bg-muted px-1 rounded">chrome://extensions/</code>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-foreground mr-2">3.</span>
                  Enable "Developer mode" in the top right
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-foreground mr-2">4.</span>
                  Click "Load unpacked" and select the extension folder
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-foreground mr-2">5.</span>
                  Pin the Spek Tools extension to your toolbar
                </li>
              </ol>
            </CardContent>
          </Card>

          <Button 
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-6 text-lg font-semibold"
            onClick={() => {
              // Create a zip file with all extension files
              const link = document.createElement('a');
              link.href = '/spek-tools-extension.zip';
              link.download = 'spek-tools-extension.zip';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Chrome Extension
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Compatible with Chrome 88+ and all Chromium-based browsers
          </p>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Privacy First Design</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your data stays yours. All processing happens locally in your browser when possible, 
            with secure API calls for advanced features. No tracking, no storage.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Processing</h3>
              <p className="text-sm text-muted-foreground">
                Industry-grade encryption and secure API endpoints
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">No Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Zero data collection, no cookies, complete privacy
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Local First</h3>
              <p className="text-sm text-muted-foreground">
                Most processing happens directly in your browser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Spek Tools. Built with ❤️ for designers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;