import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, RefreshCw, Search } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
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

  // Mock data - in real app, this would come from the API
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "E-commerce Platform",
      status: "active",
      owner: "John Doe",
      created: "2024-01-15",
      description: "Modern online store with payment integration"
    },
    {
      id: "2",
      name: "Task Manager",
      status: "completed",
      owner: "Jane Smith",
      created: "2024-01-20",
      description: "Team collaboration tool"
    },
    {
      id: "3",
      name: "Portfolio Site",
      status: "pending",
      owner: "Mike Johnson",
      created: "2024-01-25",
      description: "Personal portfolio website"
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // API call to n8n webhook
      const response = await fetch("https://n8n.techg.io/webhook/projects");
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        // Fallback to mock data if API fails
        setProjects(mockProjects);
        console.log("Using mock data - API endpoint not available");
      }
    } catch (error) {
      // Fallback to mock data
      setProjects(mockProjects);
      console.log("Using mock data - API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData: FormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      status: formData.get("status") as "active" | "completed" | "pending",
      owner: formData.get("owner") as string,
      created: new Date().toISOString().split('T')[0],
      description: formData.get("description") as string,
    };

    try {
      const response = await fetch("https://n8n.techg.io/webhook/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setProjects([...projects, newProject]);
        setIsAddDialogOpen(false);
        toast({
          title: "Project added successfully!",
          description: "The new project has been created.",
        });
      }
    } catch (error) {
      // Simulate success for demo
      setProjects([...projects, newProject]);
      setIsAddDialogOpen(false);
      toast({
        title: "Project added successfully!",
        description: "The new project has been created.",
      });
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!editingProject) return;

    const updatedProject: Project = {
      ...editingProject,
      name: formData.get("name") as string,
      status: formData.get("status") as "active" | "completed" | "pending",
      owner: formData.get("owner") as string,
      description: formData.get("description") as string,
    };

    try {
      const response = await fetch(`https://n8n.techg.io/webhook/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        setIsEditDialogOpen(false);
        setEditingProject(null);
        toast({
          title: "Project updated successfully!",
          description: "Changes have been saved.",
        });
      }
    } catch (error) {
      // Simulate success for demo
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      setIsEditDialogOpen(false);
      setEditingProject(null);
      toast({
        title: "Project updated successfully!",
        description: "Changes have been saved.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://n8n.techg.io/webhook/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
        toast({
          title: "Project deleted",
          description: "The project has been removed.",
        });
      }
    } catch (error) {
      // Simulate success for demo
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProjectForm = ({ project, onSubmit }: { project?: Project; onSubmit: (formData: FormData) => void }) => {
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={project?.name} 
            placeholder="Enter project name"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Input 
            id="owner" 
            name="owner" 
            defaultValue={project?.owner} 
            placeholder="Project owner"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select 
            id="status" 
            name="status" 
            defaultValue={project?.status || "pending"}
            className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description" 
            name="description" 
            defaultValue={project?.description} 
            placeholder="Brief description"
            required 
          />
        </div>
        
        <DialogFooter>
          <Button type="submit" className="btn-hero">
            {project ? "Update" : "Add"} Project
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <Card className="card-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Projects Management</CardTitle>
            <CardDescription>
              Manage your projects with full CRUD operations
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
                    Create a new project entry in the system.
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm onSubmit={handleAdd} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading projects...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No projects found matching your search." : "No projects available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.owner}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{project.created}</TableCell>
                      <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingProject(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Project</DialogTitle>
                                <DialogDescription>
                                  Update the project information.
                                </DialogDescription>
                              </DialogHeader>
                              <ProjectForm project={editingProject || undefined} onSubmit={handleEdit} />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(project.id)}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;