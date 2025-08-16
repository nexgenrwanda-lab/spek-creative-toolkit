import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Palette, ImageIcon } from "lucide-react";

const Index = () => {
  const tools = [
    {
      id: "fonts",
      title: "Spek Fonts",
      description: "Identify fonts from images and connect to Google Fonts",
      icon: <Type className="w-8 h-8" />,
      color: "fonts",
      gradient: "bg-gradient-fonts",
      link: "/fonts"
    },
    {
      id: "palette",
      title: "Spek Palette",
      description: "Extract color palettes from any image",
      icon: <Palette className="w-8 h-8" />,
      color: "palette",
      gradient: "bg-gradient-palette",
      link: "/palette"
    },
    {
      id: "background",
      title: "Spek Background",
      description: "Remove backgrounds from images instantly",
      icon: <ImageIcon className="w-8 h-8" />,
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              </div>
              <div className="w-4 h-4 bg-primary rounded-full" />
              <div className="w-4 h-4 bg-fonts border-2 border-fonts" />
            </div>
            <h1 className="text-3xl font-bold">Spek Tools</h1>
          </div>
          <p className="text-muted-foreground mt-2">Professional design tools for creators</p>
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
                  <div className={`${tool.gradient} p-4 rounded-2xl w-fit mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
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