import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Type,
  Square,
  MousePointer,
  Layout,
  Database,
  Image,
  Menu,
  Settings,
  Rocket,
  Save,
  Eye,
  Undo,
  Redo,
  Copy,
  Trash2,
  MessageCircle,
  Zap
} from "lucide-react";

interface AppBuilderProps {
  onBack: () => void;
}

const AppBuilder = ({ onBack }: AppBuilderProps) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("My Awesome App");

  const components = [
    { id: "hero", name: "Hero Section", icon: Layout, category: "Layout" },
    { id: "text", name: "Text Block", icon: Type, category: "Content" },
    { id: "button", name: "Button", icon: MousePointer, category: "Interactive" },
    { id: "form", name: "Contact Form", icon: Square, category: "Interactive" },
    { id: "table", name: "Data Table", icon: Database, category: "Data" },
    { id: "image", name: "Image", icon: Image, category: "Media" },
  ];

  const canvasComponents = [
    { id: "hero-1", type: "hero", x: 50, y: 50, width: 300, height: 200 },
    { id: "text-1", type: "text", x: 50, y: 280, width: 200, height: 50 },
    { id: "button-1", type: "button", x: 50, y: 350, width: 120, height: 40 },
  ];

  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, typeof components>);

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("text/plain", componentType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData("text/plain");
    console.log("Dropped component:", componentType);
    // Add component to canvas logic here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <SidebarProvider className="min-h-screen">
      <div className="flex w-full min-h-screen bg-background">
        {/* Left Sidebar - Component Library */}
        <Sidebar className="w-80 border-r border-border">
          <SidebarContent>
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Component Library</h2>
              <p className="text-sm text-muted-foreground">Drag components to canvas</p>
            </div>
            
            {Object.entries(groupedComponents).map(([category, items]) => (
              <SidebarGroup key={category}>
                <SidebarGroupLabel>{category}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="grid grid-cols-1 gap-2 p-2">
                    {items.map((component) => (
                      <Card 
                        key={component.id}
                        className="cursor-grab active:cursor-grabbing hover:shadow-medium transition-all duration-200"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <component.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{component.name}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Button variant="ghost" onClick={onBack}>
                ← Back to Projects
              </Button>
              <div className="flex items-center space-x-2">
                <Input 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="font-semibold bg-transparent border-none focus:bg-background"
                />
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button className="btn-hero">
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </header>

          {/* Canvas Area */}
          <div className="flex-1 flex">
            <div className="flex-1 bg-secondary/10 relative overflow-auto">
              <div 
                className="w-full h-full min-h-[800px] bg-background m-8 rounded-lg shadow-soft relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {/* Canvas Grid */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Canvas Components */}
                {canvasComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                      selectedComponent === component.id 
                        ? 'border-primary shadow-glow' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    style={{
                      left: component.x,
                      top: component.y,
                      width: component.width,
                      height: component.height,
                    }}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    {component.type === "hero" && (
                      <div className="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold mb-2">Hero Title</h1>
                          <p>Subtitle text</p>
                        </div>
                      </div>
                    )}
                    {component.type === "text" && (
                      <div className="w-full h-full flex items-center">
                        <p className="text-foreground">Sample text content</p>
                      </div>
                    )}
                    {component.type === "button" && (
                      <Button className="w-full h-full">
                        Click Me
                      </Button>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {canvasComponents.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Layout className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-medium mb-2">Start Building</h3>
                      <p>Drag components from the left sidebar to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Properties Inspector */}
            <div className="w-80 border-l border-border bg-background">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Properties</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedComponent ? "Edit component properties" : "Select a component to edit"}
                </p>
              </div>

              {selectedComponent ? (
                <div className="p-4 space-y-6">
                  <Tabs defaultValue="style">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="style">Style</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="api">API</TabsTrigger>
                    </TabsList>

                    <TabsContent value="style" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <Input placeholder="300px" />
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <Input placeholder="200px" />
                      </div>
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex space-x-2">
                          <Input placeholder="#ffffff" />
                          <div className="w-10 h-10 bg-primary rounded border"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Border Radius</Label>
                        <Input placeholder="8px" />
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Text Content</Label>
                        <Input placeholder="Enter text..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Link URL</Label>
                        <Input placeholder="https://..." />
                      </div>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>API Endpoint</Label>
                        <Input placeholder="https://n8n.techg.io/webhook/..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Method</Label>
                        <Input placeholder="GET" />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex space-x-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Settings className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Select a component to see its properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Button */}
      <Button 
        className="fixed bottom-6 right-6 btn-hero rounded-full w-14 h-14 shadow-glow animate-pulse"
        size="lg"
      >
        <Zap className="w-6 h-6" />
      </Button>

      {/* AI Assistant Tooltip */}
      <div className="fixed bottom-20 right-6 bg-card border border-border rounded-lg p-3 shadow-medium max-w-xs opacity-90">
        <p className="text-sm font-medium">Ask AI to Edit</p>
        <p className="text-xs text-muted-foreground">
          Click to get AI assistance with your design
        </p>
      </div>
    </SidebarProvider>
  );
};

export default AppBuilder;