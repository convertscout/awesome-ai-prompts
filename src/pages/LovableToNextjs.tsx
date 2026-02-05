import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
 import { ArrowRight, FileCode, Layers, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
 import { ConversionTool } from "@/components/conversion-tool/ConversionTool";

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

const LovableToNextjs = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
     title: 'Lovable to Next.js Converter - Free Vite Migration Tool 2025',
     description: 'Free tool to convert Lovable (Vite) projects to Next.js App Router. Generate personalized migration prompts for Supabase SSR, React Router, and more. Works with Cursor & Claude.',
    canonical: 'https://lovabledirectory.site/lovable-to-nextjs',
     keywords: ['lovable to nextjs', 'lovable.dev to next.js', 'lovable to next.js conversion', 'vite to nextjs migration', 'lovable export nextjs', 'lovable.dev to next.js conversion prompt'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Lovable to Next.js', url: 'https://lovabledirectory.site/lovable-to-nextjs' }
    ]
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%next%,description.ilike.%next.js%,tags.cs.{nextjs}')
        .order("favorites_count", { ascending: false })
        .limit(12);

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
          "name": "Can I convert a Lovable project to Next.js?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Lovable projects built with React and Vite can be converted to Next.js. The process involves migrating from Vite's build system to Next.js App Router, updating routing patterns, and adapting data fetching strategies."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert Lovable to Next.js?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Converting to Next.js provides benefits like server-side rendering (SSR), static site generation (SSG), API routes, better SEO, and the full Next.js ecosystem. It's ideal for production apps that need these features."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the conversion take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A basic Lovable to Next.js conversion takes 2-4 hours for small projects. Larger projects with complex routing, authentication, or Supabase integration may take 1-2 days."
          }
        },
        {
          "@type": "Question",
          "name": "Will my Supabase integration work in Next.js?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Supabase works seamlessly with Next.js. You'll need to set up the @supabase/ssr package for server-side auth and use Server Components for data fetching. Our prompts guide you through this process."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-nextjs-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const conversionSteps = [
    {
      step: 1,
      title: "Export Your Lovable Code",
      description: "Connect GitHub to your Lovable project and push your codebase to a repository."
    },
    {
      step: 2,
      title: "Create Next.js Project",
      description: "Run 'npx create-next-app@latest' with App Router enabled and TypeScript."
    },
    {
      step: 3,
      title: "Migrate Components",
      description: "Copy your React components from src/components. Most will work with minimal changes."
    },
    {
      step: 4,
      title: "Convert Routing",
      description: "Replace React Router with Next.js file-based routing in the app/ directory."
    },
    {
      step: 5,
      title: "Update Data Fetching",
      description: "Convert useEffect data fetching to Server Components or use React Query with SSR."
    },
    {
      step: 6,
      title: "Configure Supabase SSR",
      description: "Install @supabase/ssr and set up server-side authentication and cookies."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">Lovable to Next.js</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <div>
                 <Badge variant="secondary" className="mb-2">Free Tool</Badge>
                 <h1 className="text-3xl md:text-4xl font-bold">Lovable to Next.js Conversion Tool</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
               Generate personalized migration prompts for your Lovable (Vite) project. 
               Select your stack below and get a complete, copy-ready conversion guide for Cursor, Claude, or ChatGPT.
            </p>
          </div>

           {/* Interactive Conversion Tool */}
           <ConversionTool />

          {/* Step-by-Step Guide */}
          <section>
             <h2 className="text-2xl font-bold mb-6">Manual Conversion Steps</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversionSteps.map((item) => (
                <div key={item.step} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Benefits */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Why Convert to Next.js?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Server-Side Rendering (SSR)</h3>
                  <p className="text-sm text-muted-foreground">Faster initial page loads and better SEO with pre-rendered content.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">API Routes</h3>
                  <p className="text-sm text-muted-foreground">Build backend APIs directly in your Next.js app without external services.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Static Site Generation</h3>
                  <p className="text-sm text-muted-foreground">Pre-build pages at compile time for maximum performance.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Vercel Deployment</h3>
                  <p className="text-sm text-muted-foreground">Seamless deployment with edge functions and global CDN.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Prompts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Next.js & Lovable Conversion Prompts</h2>
              <Button variant="outline" asChild>
                <Link to="/browse?search=nextjs">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading prompts...</p>
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
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Next.js prompts coming soon!</p>
                <Button asChild className="mt-4">
                  <Link to="/browse">Browse All Prompts</Link>
                </Button>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Can I convert a Lovable project to Next.js?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Lovable projects built with React and Vite can be converted to Next.js. The process 
                  involves migrating from Vite's build system to Next.js App Router, updating routing patterns, 
                  and adapting data fetching strategies.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Why convert Lovable to Next.js?</h3>
                <p className="text-muted-foreground text-sm">
                  Converting to Next.js provides benefits like server-side rendering (SSR), static site 
                  generation (SSG), API routes, better SEO, and the full Next.js ecosystem. It's ideal 
                  for production apps that need these features.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Will my Supabase integration work in Next.js?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Supabase works seamlessly with Next.js. You'll need to set up the @supabase/ssr 
                  package for server-side auth and use Server Components for data fetching.
                </p>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Related Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/lovable-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Lovable Prompts</p>
                <p className="text-xs text-muted-foreground">AI app builder</p>
              </Link>
              <Link to="/cursor-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Cursor Prompts</p>
                <p className="text-xs text-muted-foreground">IDE integration</p>
              </Link>
              <Link to="/best-ai-for-coding" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Best AI for Coding</p>
                <p className="text-xs text-muted-foreground">Tool comparison</p>
              </Link>
              <Link to="/browse?search=react" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">React Prompts</p>
                <p className="text-xs text-muted-foreground">Components & hooks</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LovableToNextjs;
