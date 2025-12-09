import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
}

const GithubCopilotPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // SEO optimized for "GitHub Copilot prompts" keyword
  useSEO({
    title: 'GitHub Copilot Prompts 2024 - Best Instructions & Tips | Vibe Coding Directory',
    description: 'Optimize GitHub Copilot with better prompts. 30+ curated instructions for GitHub Copilot. Get better code suggestions with proven prompt patterns.',
    canonical: 'https://lovabledirectory.site/github-copilot-prompts',
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%copilot%,description.ilike.%copilot%,title.ilike.%github%,tags.cs.{copilot},tags.cs.{github}')
        .order("favorites_count", { ascending: false })
        .limit(24);

      if (data) setPrompts(data);
      setLoading(false);
    };

    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("favorites")
          .select("prompt_id")
          .eq("user_id", user.id);
        if (data) setFavoriteIds(new Set(data.map((f) => f.prompt_id)));
      }
    };

    fetchPrompts();
    fetchFavorites();
  }, []);

  // FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is GitHub Copilot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GitHub Copilot is an AI pair programmer that suggests code completions as you type. It's powered by OpenAI and trained on billions of lines of public code to help you write code faster."
          }
        },
        {
          "@type": "Question",
          "name": "How can prompts improve GitHub Copilot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Better comments and context help Copilot understand what you're trying to build. Our prompts teach you patterns for writing effective comments that guide Copilot to generate the exact code you need."
          }
        },
        {
          "@type": "Question",
          "name": "Does GitHub Copilot work with all languages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GitHub Copilot works best with popular languages like Python, JavaScript, TypeScript, Ruby, Go, C#, and C++. It can also help with many other languages, though quality varies."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-copilot-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">GitHub Copilot Prompts</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">GitHub Copilot Prompts</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Get better AI code suggestions
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              Unlock the full potential of GitHub Copilot with our prompt patterns. 
              Learn how to write comments and context that guide Copilot to generate 
              exactly the code you need, faster and more accurately.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=javascript">JavaScript</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=python">Python</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=typescript">TypeScript</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cursor-prompts">Cursor Prompts <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading GitHub Copilot prompts...</p>
            </div>
          ) : prompts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  slug={prompt.slug}
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category}
                  tags={prompt.tags}
                  viewsCount={prompt.views_count}
                  favoritesCount={prompt.favorites_count}
                  isFavorited={favoriteIds.has(prompt.id)}
                  onFavoriteToggle={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No GitHub Copilot prompts found yet.</p>
              <Button asChild className="mt-4">
                <Link to="/browse">Browse All Prompts</Link>
              </Button>
            </div>
          )}

          {/* FAQ Section */}
          <section className="border-t border-border pt-8 mt-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">What is GitHub Copilot?</h3>
                <p className="text-muted-foreground text-sm">
                  GitHub Copilot is an AI pair programmer that suggests code completions as you type. 
                  It's powered by OpenAI and trained on billions of lines of public code to help you 
                  write code faster.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">How can prompts improve GitHub Copilot?</h3>
                <p className="text-muted-foreground text-sm">
                  Better comments and context help Copilot understand what you're trying to build. 
                  Our prompts teach you patterns for writing effective comments that guide Copilot 
                  to generate the exact code you need.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Does GitHub Copilot work with all languages?</h3>
                <p className="text-muted-foreground text-sm">
                  GitHub Copilot works best with popular languages like Python, JavaScript, TypeScript, 
                  Ruby, Go, C#, and C++. It can also help with many other languages, though quality varies.
                </p>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Explore More Prompts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/cursor-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Cursor Prompts</p>
                <p className="text-xs text-muted-foreground">AI code editor</p>
              </Link>
              <Link to="/lovable-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Lovable Prompts</p>
                <p className="text-xs text-muted-foreground">AI app builder</p>
              </Link>
              <Link to="/categories" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">By Language</p>
                <p className="text-xs text-muted-foreground">TypeScript, Python</p>
              </Link>
              <Link to="/trending" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Trending</p>
                <p className="text-xs text-muted-foreground">Most popular</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GithubCopilotPrompts;
