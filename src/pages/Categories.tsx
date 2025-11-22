import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Palette,
  Boxes,
  Plug,
  Target,
  Sparkles,
  FileText,
  Layout,
  BarChart3,
  Lock,
  Zap,
} from "lucide-react";

const categories = [
  {
    name: "UI/UX",
    key: "ui_ux",
    icon: Palette,
    description: "Beautiful user interfaces and user experiences",
    count: 0,
  },
  {
    name: "Components",
    key: "components",
    icon: Boxes,
    description: "Reusable UI components and patterns",
    count: 0,
  },
  {
    name: "Integrations",
    key: "integrations",
    icon: Plug,
    description: "Connect with external services and APIs",
    count: 0,
  },
  {
    name: "Best Practices",
    key: "best_practices",
    icon: Target,
    description: "Proven patterns and coding standards",
    count: 0,
  },
  {
    name: "Animations",
    key: "animations",
    icon: Sparkles,
    description: "Motion design and micro-interactions",
    count: 0,
  },
  {
    name: "Forms",
    key: "forms",
    icon: FileText,
    description: "Form validation and data collection",
    count: 0,
  },
  {
    name: "Layouts",
    key: "layouts",
    icon: Layout,
    description: "Page structures and responsive designs",
    count: 0,
  },
  {
    name: "Data Visualization",
    key: "data_visualization",
    icon: BarChart3,
    description: "Charts, graphs, and data presentation",
    count: 0,
  },
  {
    name: "Authentication",
    key: "authentication",
    icon: Lock,
    description: "User login, signup, and security",
    count: 0,
  },
  {
    name: "Performance",
    key: "performance",
    icon: Zap,
    description: "Speed optimization and best practices",
    count: 0,
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Browse by{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Category
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore prompts organized by topic to find exactly what you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.key}
                  to={`/browse?search=${encodeURIComponent(category.name.toLowerCase())}`}
                >
                  <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer h-full">
                    <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
