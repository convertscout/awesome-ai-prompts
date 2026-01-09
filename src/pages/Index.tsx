import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { SpotlightPrompt } from "@/components/SpotlightPrompt";
import { useSEO } from "@/hooks/useSEO";
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
  content?: string;
  language?: string;
  framework?: string;
  content_type?: string;
  logo_url?: string;
}

const Index = () => {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useSEO({
    title: 'AI Coding Prompts Directory - Free Prompt Generator, Cursor Rules 2025',
    description: 'Free AI prompt generator & 160+ coding prompts for ChatGPT, Cursor AI, Claude, GitHub Copilot & Gemini. Generate rules files, system prompts in seconds.',
    canonical: 'https://lovabledirectory.site/',
    ogType: 'website',
  });

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best AI prompts for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI coding prompts include structured prompts for ChatGPT, Cursor AI, Claude, and GitHub Copilot. Our directory features 160+ copy-paste ready prompts optimized for code generation, debugging, and refactoring."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use ChatGPT for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use ChatGPT for coding by providing clear, specific prompts. Our ChatGPT coding prompts help you generate code, debug errors, write tests, and refactor existing code. Simply copy a prompt and paste it into ChatGPT."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best AI for coding in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI coding tools in 2025 include ChatGPT, Cursor AI, Claude, GitHub Copilot, and Google Gemini. Each excels in different areas - ChatGPT for general coding, Cursor for IDE integration, Claude for complex reasoning, and Copilot for code completion."
          }
        },
        {
          "@type": "Question",
          "name": "Are these AI coding prompts free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All prompts in our AI coding prompts directory are completely free. Copy-paste ready prompts for ChatGPT, Cursor, Claude, Copilot, Gemini and 10+ AI tools."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-homepage-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [featuredRes, allRes] = await Promise.all([
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").order("favorites_count", { ascending: false }).order("views_count", { ascending: false }).limit(6),
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").order("created_at", { ascending: false }).limit(6),
      ]);
      
      if (featuredRes.data) setFeaturedPrompts(featuredRes.data);
      if (allRes.data) setAllPrompts(allRes.data);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <PWAInstallPrompt />

      {/* Hero Section */}
      <section className="pt-16 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              alt="Lovable Directory Logo" 
              src="/lovable-uploads/81abbcb3-4813-4575-8167-480ea5e6696e.png" 
              className="h-12 w-12 object-fill" 
            />
            <h1 className="text-2xl md:text-3xl font-semibold">
              AI Coding Prompts
            </h1>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Copy-paste ready prompts for ChatGPT, Cursor, Claude, Copilot & more
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search prompts..." 
                className="pl-11 h-12 bg-muted/50 border-border text-base" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
          </form>

          {/* Simple Generator CTA */}
          <Link to="/generate">
            <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
              Generate Custom Prompts
            </Button>
          </Link>
        </div>
      </section>

      {/* Spotlight Prompt */}
      {featuredPrompts.length > 0 && featuredPrompts[0].content && (
        <section className="pb-10 px-4">
          <div className="max-w-3xl mx-auto">
            <SpotlightPrompt
              id={featuredPrompts[0].id}
              slug={featuredPrompts[0].slug}
              title={featuredPrompts[0].title}
              description={featuredPrompts[0].description}
              content={featuredPrompts[0].content}
              viewsCount={featuredPrompts[0].views_count}
              favoritesCount={featuredPrompts[0].favorites_count}
            />
          </div>
        </section>
      )}

      {/* Latest Prompts */}
      {allPrompts.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Latest Prompts</h2>
              <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPrompts.slice(0, 3).map(prompt => (
                <Link 
                  key={prompt.id} 
                  to={`/prompt/${prompt.slug}`} 
                  className="group p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {prompt.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prompt.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Languages */}
      <section className="py-10 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Popular Languages</h2>
            <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {["TypeScript", "React", "Next.js", "Python", "TailwindCSS", "Supabase"].map(lang => (
              <Link 
                key={lang} 
                to={`/browse?search=${encodeURIComponent(lang.toLowerCase())}`} 
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors text-center"
              >
                <p className="text-sm font-medium">{lang}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
