import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPages from "@/components/AuthPages";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import AppBuilder from "@/components/AppBuilder";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const IndexContent = () => {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard" | "builder">("landing");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      setCurrentView("dashboard");
    } else if (!loading && !user && currentView !== "landing" && currentView !== "auth") {
      setCurrentView("landing");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === "landing" && (
        <LandingPage onGetStarted={() => setCurrentView("auth")} />
      )}
      
      {currentView === "auth" && (
        <AuthPages onBack={() => setCurrentView("landing")} />
      )}
      
      {currentView === "dashboard" && (
        <ProjectsDashboard
          onCreateProject={() => setCurrentView("builder")}
          onOpenProject={(projectId) => {
            console.log("Opening project:", projectId);
            setCurrentView("builder");
          }}
          onLogout={() => setCurrentView("landing")}
        />
      )}
      
      {currentView === "builder" && (
        <AppBuilder onBack={() => setCurrentView("dashboard")} />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;