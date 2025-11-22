import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, Users, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
}

const Index = () => {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFeaturedPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        setFeaturedPrompts(data);
      }
    };

    fetchFeaturedPrompts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Community-curated prompts for Lovable</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build & Ship Faster with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Expert Prompts
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover curated prompts, templates, and best practices from the Lovable community. 
              Speed up your development with battle-tested patterns.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts, components, patterns..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-gradient-primary hover:opacity-90">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Popular:</span>
              {["Authentication", "UI Components", "Animations", "Forms"].map((tag) => (
                <Link
                  key={tag}
                  to={`/browse?search=${encodeURIComponent(tag.toLowerCase())}`}
                  className="hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Curated Prompts",
                description: "Hand-picked prompts from experienced Lovable developers",
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Share your best prompts and learn from others",
              },
              {
                icon: Code2,
                title: "Production Ready",
                description: "Battle-tested patterns and best practices",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-card transition-all"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      {featuredPrompts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Prompts</h2>
                <p className="text-muted-foreground">
                  Top picks from the community
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/browse">View All</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category}
                  tags={prompt.tags}
                  viewsCount={prompt.views_count}
                  favoritesCount={prompt.favorites_count}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Join the Lovable Community
            </h2>
            <p className="text-xl text-muted-foreground">
              Get access to exclusive prompts, save your favorites, and contribute your own.
            </p>
            <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/auth">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
