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
import { SponsorCard } from "@/components/SponsorCard";
import { SponsorStrip } from "@/components/SponsorStrip";

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
    title: 'Lovable Directory - Prompts, Templates & Tools for Lovable.dev',
    description: 'The #1 resource for Lovable.dev prompts, UI templates, and migration tools. Fix hallucinations, build sleek UIs, and convert Lovable projects to Next.js.',
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
          "name": "What is Lovable Directory?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lovable Directory is the #1 third-party resource for Lovable.dev users. Browse 200+ curated prompts, UI templates, hallucination fixes, and migration tools to build better apps with Lovable."
          }
        },
        {
          "@type": "Question",
          "name": "How do I fix UI hallucinations in Lovable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our curated Lovable UI prompts to prevent placeholder content, fix hallucinated components, and ensure real data displays correctly. Our hallucination fix prompts are copy-paste ready."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert a Lovable project to Next.js?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our free Lovable to Next.js conversion tool to generate personalized migration prompts. It supports Supabase SSR, authentication, React Router migration, Tailwind CSS, and shadcn/ui components."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best Lovable prompts for sleek UI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Lovable UI Prompts collection includes tested prompts for minimal designs, glassmorphism, dark mode, dashboard layouts, and SaaS templates. Each prompt is optimized to produce production-ready UI in Lovable."
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

      {/* Mobile Sponsor Strip - Top */}
      <div className="xl:hidden">
        <SponsorStrip />
      </div>

      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar - Sponsors */}
        <aside className="hidden xl:block w-48 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)]">
          <SponsorCard />
          <SponsorCard />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
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
                  Lovable Directory
                </h1>
              </div>
              
              <p className="text-muted-foreground mb-6">
                The #1 resource for Lovable.dev prompts, UI templates, and migration tools
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

          {/* Lovable Categories */}
          <section className="py-10 px-4 pb-16">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Explore Lovable Resources</h2>
                <Link to="/lovable-prompts" className="text-sm text-muted-foreground hover:text-foreground">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "UI Prompts", href: "/lovable-ui-prompts" },
                  { label: "Dark Theme", href: "/lovable-dark-theme-prompts" },
                  { label: "Hallucination Fixes", href: "/lovable-ui-prompts" },
                  { label: "Migration Tools", href: "/lovable-to-nextjs" },
                  { label: "Best Practices", href: "/lovable-prompts" },
                  { label: "Prompt Generator", href: "/generate" },
                ].map(item => (
                  <Link 
                    key={item.label} 
                    to={item.href} 
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors text-center"
                  >
                    <p className="text-sm font-medium">{item.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar - Sponsors */}
        <aside className="hidden xl:block w-48 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)]">
          <SponsorCard />
          <SponsorCard />
        </aside>
      </div>

      {/* Mobile Sponsor Strip - Bottom */}
      <div className="xl:hidden">
        <SponsorStrip />
      </div>
    </div>
  );
};

export default Index;
