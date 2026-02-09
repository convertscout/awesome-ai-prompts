import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Paintbrush, ArrowRight, Sparkles, Palette, Layout, Zap } from "lucide-react";
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

const LovableUIPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // SEO optimized for "Lovable UI prompts" keyword - the converting query
  useSEO({
    title: `Lovable UI Prompts 2025 - Fix Hallucinations & Build Sleek Designs | Lovable Directory`,
    description: 'Best Lovable UI prompts to fix hallucinations, build sleek designs, and avoid placeholder content. Copy-paste ready prompts for beautiful app interfaces.',
    canonical: 'https://lovable.directory/lovable-ui-prompts',
    breadcrumbs: [
      { name: 'Home', url: 'https://lovable.directory' },
      { name: 'Lovable Prompts', url: 'https://lovable.directory/lovable-prompts' },
      { name: 'UI Prompts', url: 'https://lovable.directory/lovable-ui-prompts' },
    ],
  });

  useEffect(() => {
    const fetchUIPrompts = async () => {
      // Fetch prompts specifically about UI, design, hallucinations, sleek, etc.
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%ui%,title.ilike.%design%,title.ilike.%sleek%,title.ilike.%hallucination%,description.ilike.%ui%,description.ilike.%interface%,tags.cs.{ui},tags.cs.{design}')
        .ilike('title', '%lovable%')
        .order("views_count", { ascending: false })
        .limit(30);

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

    fetchUIPrompts();
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
          "name": "How do I fix UI hallucinations in Lovable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use specific prompts that describe exactly what you want. Include details like 'no placeholder images', 'use real content', and 'avoid Lorem Ipsum'. Our Lovable UI Hallucination Fix prompt provides tested instructions to prevent AI from generating fake or placeholder content."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best Lovable prompts for sleek UI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best Lovable UI prompts include specific design keywords like 'minimal', 'modern', 'glassmorphism', or 'sleek'. Combine these with color palette instructions and spacing guidelines. Our curated collection includes prompts for SaaS dashboards, landing pages, and mobile-first designs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I avoid placeholder content in Lovable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Add explicit instructions in your prompt: 'Use real, meaningful content instead of Lorem Ipsum', 'Generate actual product names and descriptions', 'Create realistic user data'. Our Real Content UI prompt includes all these instructions pre-written."
          }
        },
        {
          "@type": "Question",
          "name": "What UI styles work best with Lovable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lovable excels at modern UI styles including: Minimal/Clean designs, Glassmorphism effects, Dark mode interfaces, Gradient-heavy designs, and Tailwind-based components. Use our buzzword prompts to achieve specific aesthetic results."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-lovable-ui-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  // UI categories for quick filtering
  const uiCategories = [
    { label: "Fix Hallucinations", icon: Zap, search: "hallucination" },
    { label: "Sleek Designs", icon: Sparkles, search: "sleek" },
    { label: "Color Schemes", icon: Palette, search: "color" },
    { label: "Layouts", icon: Layout, search: "layout" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/lovable-prompts" className="hover:text-foreground">Lovable Prompts</Link>
            <span>/</span>
            <span className="text-foreground">UI Prompts</span>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Paintbrush className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Lovable UI Prompts 2025</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Fix Hallucinations & Build Sleek Designs
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              Stop getting placeholder content and generic designs. These UI-focused prompts help you 
              build beautiful, polished interfaces with Lovable. From fixing AI hallucinations to 
              achieving specific design aesthetics.
            </p>
          </div>

          {/* UI Category Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uiCategories.map((cat) => (
              <Link 
                key={cat.search}
                to={`/browse?search=${cat.search}+lovable`}
                className="flex items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <cat.icon className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">{cat.label}</span>
              </Link>
            ))}
          </div>

          {/* Featured UI Prompts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Top UI Prompts</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lovable-prompts">
                  All Lovable Prompts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading UI prompts...</p>
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
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Paintbrush className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No UI-specific prompts found yet.</p>
                <Button asChild>
                  <Link to="/lovable-prompts">Browse All Lovable Prompts</Link>
                </Button>
              </div>
            )}
          </section>

          {/* FAQ Section (visible content matching schema) */}
          <section className="border-t border-border pt-8 mt-12">
            <h2 className="text-2xl font-semibold mb-6">Lovable UI Prompts FAQ</h2>
            <div className="space-y-6">
              <div className="p-4 bg-accent/30 rounded-lg">
                <h3 className="font-medium mb-2">How do I fix UI hallucinations in Lovable?</h3>
                <p className="text-muted-foreground text-sm">
                  Use specific prompts that describe exactly what you want. Include details like 
                  "no placeholder images", "use real content", and "avoid Lorem Ipsum". Our 
                  Lovable UI Hallucination Fix prompt provides tested instructions to prevent 
                  AI from generating fake or placeholder content.
                </p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h3 className="font-medium mb-2">What are the best Lovable prompts for sleek UI?</h3>
                <p className="text-muted-foreground text-sm">
                  The best Lovable UI prompts include specific design keywords like "minimal", 
                  "modern", "glassmorphism", or "sleek". Combine these with color palette 
                  instructions and spacing guidelines. Our curated collection includes prompts 
                  for SaaS dashboards, landing pages, and mobile-first designs.
                </p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h3 className="font-medium mb-2">How do I avoid placeholder content in Lovable?</h3>
                <p className="text-muted-foreground text-sm">
                  Add explicit instructions in your prompt: "Use real, meaningful content instead 
                  of Lorem Ipsum", "Generate actual product names and descriptions", "Create 
                  realistic user data". Our Real Content UI prompt includes all these instructions pre-written.
                </p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h3 className="font-medium mb-2">What UI styles work best with Lovable?</h3>
                <p className="text-muted-foreground text-sm">
                  Lovable excels at modern UI styles including: Minimal/Clean designs, 
                  Glassmorphism effects, Dark mode interfaces, Gradient-heavy designs, and 
                  Tailwind-based components. Use our buzzword prompts to achieve specific aesthetic results.
                </p>
              </div>
            </div>
          </section>

          {/* Internal Links - Topic Cluster */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Explore Lovable Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/lovable-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">All Lovable Prompts</p>
                <p className="text-xs text-muted-foreground">40+ templates</p>
              </Link>
              <Link to="/lovable-to-nextjs" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Lovable → Next.js</p>
                <p className="text-xs text-muted-foreground">Migration tool</p>
              </Link>
              <Link to="/generate" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Prompt Generator</p>
                <p className="text-xs text-muted-foreground">AI-powered</p>
              </Link>
              <Link to="/browse?search=lovable" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Browse All</p>
                <p className="text-xs text-muted-foreground">Full directory</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LovableUIPrompts;
