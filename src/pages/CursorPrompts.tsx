import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Zap } from "lucide-react";
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

const CursorPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // SEO optimized for "Cursor AI prompts" keyword
  useSEO({
    title: 'Best Cursor AI Prompts 2024 - Free Rules & Templates | Vibe Coding Directory',
    description: 'Copy-paste ready Cursor AI prompts and rules. Boost your productivity with 50+ curated prompts for Cursor IDE. TypeScript, React, Python and more.',
    canonical: 'https://lovabledirectory.site/cursor-prompts',
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%cursor%,description.ilike.%cursor%,tags.cs.{cursor}')
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

  // FAQ Schema for rich snippets
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are Cursor AI prompts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cursor AI prompts are instructions you give to Cursor IDE's AI assistant to help you write, refactor, or debug code. They can include coding standards, best practices, and specific formatting rules."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use Cursor prompts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Copy the prompt from our directory and paste it into Cursor's .cursorrules file in your project root, or use it directly in the AI chat. The AI will follow your instructions when generating code."
          }
        },
        {
          "@type": "Question",
          "name": "Are these Cursor prompts free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All prompts in our directory are completely free to use. Just copy and paste them into your projects."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-cursor-faq', 'true');
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
              <span className="text-foreground">Cursor Prompts</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Cursor AI Prompts</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Copy-paste ready prompts for Cursor IDE
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              Boost your coding productivity with our curated collection of Cursor AI prompts. 
              From TypeScript best practices to React component patterns, find the perfect 
              prompt to supercharge your development workflow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=typescript">TypeScript</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=react">React</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=python">Python</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/lovable-prompts">Lovable Prompts <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading Cursor prompts...</p>
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
              <p className="text-muted-foreground">No Cursor prompts found yet.</p>
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
                <h3 className="font-medium mb-2">What are Cursor AI prompts?</h3>
                <p className="text-muted-foreground text-sm">
                  Cursor AI prompts are instructions you give to Cursor IDE's AI assistant to help you 
                  write, refactor, or debug code. They can include coding standards, best practices, 
                  and specific formatting rules.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">How do I use Cursor prompts?</h3>
                <p className="text-muted-foreground text-sm">
                  Copy the prompt from our directory and paste it into Cursor's .cursorrules file in 
                  your project root, or use it directly in the AI chat. The AI will follow your 
                  instructions when generating code.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Are these Cursor prompts free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! All prompts in our directory are completely free to use. Just copy and paste 
                  them into your projects.
                </p>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Explore More Prompts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/lovable-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Lovable Prompts</p>
                <p className="text-xs text-muted-foreground">AI app builder</p>
              </Link>
              <Link to="/github-copilot-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Copilot Prompts</p>
                <p className="text-xs text-muted-foreground">GitHub assistant</p>
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

export default CursorPrompts;
