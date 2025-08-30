import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Project interface to match our database schema
interface Project {
  id: string;
  name: string;
  status: "draft" | "building" | "deployed" | "failed";
  owner: string;
  created: string;
  description: string;
}

const DataTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Project interface
      const transformedProjects: Project[] = data.map(project => ({
        id: project.id,
        name: project.name,
        status: project.status as "draft" | "building" | "deployed" | "failed",
        owner: user.email || 'Unknown',
        created: new Date(project.created_at).toLocaleDateString(),
        description: project.description || ''
      }));

      setProjects(transformedProjects);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name: formData.get("name") as string,
          description: formData.get("description") as string || null,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newProject: Project = {
        id: data.id,
        name: data.name,
        status: data.status as "draft" | "building" | "deployed" | "failed",
        owner: user.email || 'Unknown',
        created: new Date(data.created_at).toLocaleDateString(),
        description: data.description || ''
      };

      setProjects(prev => [newProject, ...prev]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Project created",
        description: "New project has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject || !user) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.get("name") as string,
          description: formData.get("description") as string || null
        })
        .eq('id', editingProject.id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedProject: Project = {
        ...editingProject,
        name: formData.get("name") as string,
        description: formData.get("description") as string || ""
      };

      setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      setIsEditDialogOpen(false);
      setEditingProject(null);
      
      toast({
        title: "Project updated",
        description: "Project has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
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
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <Card className="card-elegant">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Please sign in to view your projects.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Project Management</CardTitle>
            <CardDescription>
              Manage your TECH-G projects with full CRUD operations
            </CardDescription>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to start building with TECH-G
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" name="name" placeholder="My Awesome Project" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Brief description of your project"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="btn-hero">Create Project</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No projects found matching your search." : "No projects yet. Create your first project!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{project.name}</div>
                          {project.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{project.owner}</TableCell>
                      <TableCell>{project.created}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update your project information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={editingProject?.name} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    defaultValue={editingProject?.description}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="btn-hero">Update Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DataTable;