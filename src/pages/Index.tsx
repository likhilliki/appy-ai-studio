import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import { SignUpPage, LoginPage } from "@/components/AuthPages";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import AppBuilder from "@/components/AppBuilder";
import ContactForm from "@/components/ContactForm";
import DataTable from "@/components/DataTable";

type AppState = "landing" | "signup" | "login" | "projects" | "builder" | "demo-form" | "demo-table";

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView("projects");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("landing");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleCreateProject = () => {
    setCurrentView("builder");
  };

  const handleOpenProject = () => {
    setCurrentView("builder");
  };

  const handleBackToProjects = () => {
    setCurrentView("projects");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as AppState);
  };

  // Demo routes for components
  if (currentView === "demo-form") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <button 
            onClick={handleBackToLanding}
            className="mb-6 text-primary hover:text-primary-dark"
          >
            ← Back to Landing
          </button>
          <ContactForm />
        </div>
      </div>
    );
  }

  if (currentView === "demo-table") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={handleBackToLanding}
            className="mb-6 text-primary hover:text-primary-dark"
          >
            ← Back to Landing
          </button>
          <DataTable />
        </div>
      </div>
    );
  }

  // Main app routing
  switch (currentView) {
    case "signup":
      return <SignUpPage onLogin={handleLogin} onBack={handleBackToLanding} />;
    
    case "login":
      return <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />;
    
    case "projects":
      return (
        <ProjectsDashboard 
          onCreateProject={handleCreateProject}
          onOpenProject={handleOpenProject}
          onLogout={handleLogout}
        />
      );
    
    case "builder":
      return <AppBuilder onBack={handleBackToProjects} />;
    
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
};

export default Index;
