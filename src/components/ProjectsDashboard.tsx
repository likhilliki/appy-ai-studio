import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Settings, LogOut, ExternalLink, Users, BarChart3, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectsDashboardProps {
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onLogout: () => void;
}

const ProjectsDashboard = ({ onCreateProject, onOpenProject, onLogout }: ProjectsDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, text: "Draft" },
      building: { variant: "default" as const, text: "Building" },
      deployed: { variant: "default" as const, text: "Deployed" },
      failed: { variant: "destructive" as const, text: "Failed" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">T</span>
                </div>
                <span className="text-xl font-bold text-gradient">TECH-G</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={onCreateProject} className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      TECH-G Account
                    </p>
                  </div>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">Manage your TECH-G projects and deployments</p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            Filter
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Deployed</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'deployed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Building</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'building').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-elegant animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="card-elegant hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {project.description || 'No description'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Modified {new Date(project.updated_at).toLocaleDateString()}</span>
                    {project.deploy_url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(project.deploy_url, '_blank')}
                        className="h-8 px-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenProject(project.id)}
                      className="h-8"
                    >
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProjects.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="mb-4">Create your first project to get started</p>
                  <Button onClick={onCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsDashboard;