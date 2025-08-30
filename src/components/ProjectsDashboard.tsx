import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Rocket, 
  Eye, 
  Copy, 
  Settings,
  Trash2,
  Calendar,
  Globe,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ProjectsDashboardProps {
  onCreateProject: () => void;
  onOpenProject: () => void;
  onLogout: () => void;
}

const ProjectsDashboard = ({ onCreateProject, onOpenProject, onLogout }: ProjectsDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const projects = [
    {
      id: 1,
      name: "E-commerce Store",
      description: "A modern online store with payment integration",
      status: "deployed",
      lastModified: "2 hours ago",
      deployUrl: "mystore.techg.app",
      collaborators: 3
    },
    {
      id: 2,
      name: "Task Management App",
      description: "Team collaboration tool with real-time updates",
      status: "draft",
      lastModified: "1 day ago",
      deployUrl: null,
      collaborators: 1
    },
    {
      id: 3,
      name: "Portfolio Website",
      description: "Personal portfolio with blog functionality",
      status: "deployed",
      lastModified: "3 days ago",
      deployUrl: "john-portfolio.techg.app",
      collaborators: 1
    },
    {
      id: 4,
      name: "SaaS Dashboard",
      description: "Analytics dashboard for subscription business",
      status: "building",
      lastModified: "5 hours ago",
      deployUrl: null,
      collaborators: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return <Badge className="bg-success/10 text-success border-success/20">Deployed</Badge>;
      case "building":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Building</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gradient">TECH-G</span>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
            <p className="text-muted-foreground">
              Manage and deploy your applications
            </p>
          </div>
          <Button onClick={onCreateProject} className="btn-hero mt-4 md:mt-0">
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="card-elegant hover:shadow-medium transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onOpenProject}>
                        <Eye className="w-4 h-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      {project.deployUrl && (
                        <DropdownMenuItem>
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Site
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(project.status)}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.lastModified}
                    </div>
                  </div>

                  {project.deployUrl && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="truncate">{project.deployUrl}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {project.collaborators} {project.collaborators === 1 ? 'collaborator' : 'collaborators'}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={onOpenProject}>
                        <Eye className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                      {project.status === "deployed" && (
                        <Button size="sm" variant="default">
                          <Rocket className="w-4 h-4 mr-1" />
                          Deploy
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Project Card */}
          <Card 
            className="card-elegant border-dashed border-2 hover:border-primary/50 cursor-pointer group transition-all duration-300"
            onClick={onCreateProject}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Create New Project
              </h3>
              <p className="text-muted-foreground text-sm">
                Start building your next amazing app
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">2</div>
              <div className="text-sm text-muted-foreground">Deployed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Collaborators</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">1.2k</div>
              <div className="text-sm text-muted-foreground">Monthly Views</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;