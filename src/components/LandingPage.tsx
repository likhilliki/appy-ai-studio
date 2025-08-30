import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Palette, Database, Rocket, Code, Users, Star, Check } from "lucide-react";

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onGetStarted?: () => void;
}

const LandingPage = ({ onNavigate, onGetStarted }: LandingPageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Palette,
      title: "Visual Canvas",
      description: "Drag and drop components to build your app visually. No coding required."
    },
    {
      icon: Zap,
      title: "AI Code Generation",
      description: "Our AI generates clean, production-ready code from your visual designs."
    },
    {
      icon: Database,
      title: "Database & Auth",
      description: "Built-in database, authentication, and API management out of the box."
    },
    {
      icon: Rocket,
      title: "One-Click Deploy",
      description: "Deploy your app to production with a single click. No DevOps needed."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for testing and small projects",
      features: [
        "1 Project",
        "Visual Canvas",
        "Basic Components",
        "Community Support",
        "Export Code"
      ],
      cta: "Start Building Free",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$29/month",
      description: "For growing businesses and teams",
      features: [
        "Unlimited Projects",
        "AI Code Generation",
        "Advanced Components",
        "Database & Auth",
        "Priority Support",
        "Custom Domains",
        "Team Collaboration"
      ],
      cta: "Start Pro Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "White-label Solution",
        "Advanced Security",
        "Dedicated Support",
        "Custom Integrations",
        "SLA Guarantee"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gradient">TECH-G</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
              <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">About</a>
              <Button variant="ghost" size="sm" onClick={() => onNavigate?.("login")}>Sign In</Button>
              <Button className="btn-hero" onClick={() => onNavigate?.("signup")}>Start Building</Button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto relative">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build and Deploy Your
              <span className="text-gradient block">Startup Without Code</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Empower your ideas with our AI-assisted no-code platform. Design visually, generate real code, and deploy instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-hero w-full sm:w-auto" onClick={() => onNavigate?.("signup")}>
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Free
              </Button>
              <Button variant="outline" size="lg" className="btn-ghost-hero w-full sm:w-auto" onClick={() => onNavigate?.("demo-form")}>
                <Code className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
            
            <div className="mt-16 flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Builders</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-current text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="text-gradient"> Build and Scale</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to production in minutes, not months. Our platform handles the complexity so you can focus on building.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-feature">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent
              <span className="text-gradient"> Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.highlighted ? 'ring-2 ring-primary shadow-glow' : ''}`}>
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-gradient mb-2">{tier.price}</div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.highlighted ? 'btn-hero' : ''}`}
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                    onClick={() => onNavigate?.(tier.highlighted ? "signup" : "signup")}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
            Join thousands of builders who are already creating amazing apps with TECH-G.
          </p>
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-12 py-4 text-lg font-semibold" onClick={() => onNavigate?.("signup")}>
            <Rocket className="w-5 h-5 mr-2" />
            Start Building Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gradient">TECH-G</span>
            </div>
            
            <div className="flex space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TECH-G. All rights reserved. Built with ❤️ for builders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;