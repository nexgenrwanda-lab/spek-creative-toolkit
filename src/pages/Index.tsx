import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const tools = [
    {
      id: "fonts",
      title: "Spek Fonts",
      description: "Identify fonts from images and connect to Google Fonts",
      icon: <img src="/lovable-uploads/d40d976e-6549-4f0a-802f-33df507d4a5b.png" alt="Spek Fonts" className="w-8 h-8" />,
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
      icon: <img src="/lovable-uploads/86b13327-ef02-4439-b170-7065c6658c81.png" alt="Spek Background" className="w-8 h-8" />,
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
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/5e0033bc-f334-4b8c-a108-6c953cefa845.png" 
              alt="Spek Tools Logo" 
              className="h-12"
            />
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