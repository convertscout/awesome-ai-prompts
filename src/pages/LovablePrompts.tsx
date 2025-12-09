import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Heart } from "lucide-react";
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

const LovablePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // SEO optimized for "Lovable prompts" keyword
  useSEO({
    title: `Best Lovable Prompts ${new Date().getFullYear()} - AI App Builder Templates | Lovable Directory`,
    description: 'Copy-paste ready Lovable prompts for building apps with AI. 40+ curated prompts for Lovable.dev. Build full-stack apps faster with proven templates.',
    canonical: 'https://lovable.directory/lovable-prompts',
    breadcrumbs: [
      { name: 'Home', url: 'https://lovable.directory' },
      { name: 'Lovable Prompts', url: 'https://lovable.directory/lovable-prompts' },
    ],
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%lovable%,description.ilike.%lovable%,tags.cs.{lovable}')
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
          "name": "What is Lovable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lovable is an AI-powered app builder that lets you create full-stack web applications by describing what you want in natural language. It generates React code, handles deployment, and integrates with databases."
          }
        },
        {
          "@type": "Question",
          "name": "How do Lovable prompts work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lovable prompts are detailed instructions that help Lovable's AI understand exactly what you want to build. Better prompts lead to better generated code. Copy our prompts and paste them into Lovable's chat."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use Lovable for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Lovable offers a free tier with limited credits. You can start building apps immediately without a credit card. Our prompts help you get the most out of your credits."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-lovable-faq', 'true');
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
              <span className="text-foreground">Lovable Prompts</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Lovable Prompts</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Build full-stack apps faster with AI
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              Get the most out of Lovable with our curated collection of prompts. 
              From landing pages to SaaS dashboards, find templates that help you 
              build production-ready apps in minutes, not hours.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=saas">SaaS Templates</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=dashboard">Dashboards</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse?search=landing">Landing Pages</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cursor-prompts">Cursor Prompts <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading Lovable prompts...</p>
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
              <p className="text-muted-foreground">No Lovable prompts found yet.</p>
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
                <h3 className="font-medium mb-2">What is Lovable?</h3>
                <p className="text-muted-foreground text-sm">
                  Lovable is an AI-powered app builder that lets you create full-stack web applications 
                  by describing what you want in natural language. It generates React code, handles 
                  deployment, and integrates with databases.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">How do Lovable prompts work?</h3>
                <p className="text-muted-foreground text-sm">
                  Lovable prompts are detailed instructions that help Lovable's AI understand exactly 
                  what you want to build. Better prompts lead to better generated code. Copy our 
                  prompts and paste them into Lovable's chat.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I use Lovable for free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Lovable offers a free tier with limited credits. You can start building apps 
                  immediately without a credit card. Our prompts help you get the most out of your credits.
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

export default LovablePrompts;
