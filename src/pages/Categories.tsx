import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Code2,
  Box,
  Plug,
  Palette,
  Blocks,
  FileCode,
  Database,
  Lock,
} from "lucide-react";

const languages = [
  {
    name: "TypeScript",
    icon: FileCode,
    description: "Typed JavaScript for safer code",
    count: 0,
  },
  {
    name: "React",
    icon: Box,
    description: "Build interactive user interfaces",
    count: 0,
  },
  {
    name: "Next.js",
    icon: Blocks,
    description: "React framework for production",
    count: 0,
  },
  {
    name: "Python",
    icon: Code2,
    description: "Versatile programming language",
    count: 0,
  },
  {
    name: "TailwindCSS",
    icon: Palette,
    description: "Utility-first CSS framework",
    count: 0,
  },
  {
    name: "Supabase",
    icon: Database,
    description: "Open source Firebase alternative",
    count: 0,
  },
  {
    name: "React Native",
    icon: Box,
    description: "Build native mobile apps with React",
    count: 0,
  },
  {
    name: "Authentication",
    icon: Lock,
    description: "User authentication & security",
    count: 0,
  },
  {
    name: "Expo",
    icon: Plug,
    description: "Platform for React Native apps",
    count: 0,
  },
  {
    name: "JavaScript",
    icon: FileCode,
    description: "The language of the web",
    count: 0,
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-medium mb-2">
              Languages & Frameworks
            </h1>
            <p className="text-muted-foreground">
              Browse prompts and resources by technology stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const Icon = lang.icon;
              return (
                <Link
                  key={lang.name}
                  to={`/browse?search=${encodeURIComponent(lang.name.toLowerCase())}`}
                >
                  <Card className="group p-4 border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors mb-1">
                          {lang.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {lang.description}
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
