import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";
import { Badge } from "@/components/ui/badge";

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

const GeminiPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'Best Gemini AI Prompts for Coding 2025 - Google Gemini Developer Prompts',
    description: 'Copy-paste ready Google Gemini prompts for coding. Proven prompts for Gemini Pro, Gemini Ultra & Gemini in Android Studio. Free AI coding prompts for developers.',
    canonical: 'https://lovabledirectory.site/gemini-prompts',
    keywords: ['Gemini AI prompts', 'Gemini prompts for coding', 'Google Gemini developer prompts', 'Gemini Pro coding', 'Gemini Ultra prompts'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Gemini Prompts', url: 'https://lovabledirectory.site/gemini-prompts' }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Gemini-related prompts
      const { data, error } = await supabase
        .from("prompts")
        .select("id, slug, title, description, category, tags, views_count, favorites_count")
        .or('title.ilike.%gemini%,description.ilike.%gemini%,tags.cs.{gemini}')
        .order("favorites_count", { ascending: false })
        .limit(50);

      if (data && !error) {
        setPrompts(data);
      }
      
      // If no Gemini-specific prompts, show general prompts that work with any LLM
      if (!data || data.length === 0) {
        const { data: generalData } = await supabase
          .from("prompts")
          .select("id, slug, title, description, category, tags, views_count, favorites_count")
          .order("favorites_count", { ascending: false })
          .limit(30);
        if (generalData) setPrompts(generalData);
      }
      
      setLoading(false);

      // Check for favorites if logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: favs } = await supabase
          .from("favorites")
          .select("prompt_id")
          .eq("user_id", session.user.id);
        if (favs) {
          setFavoriteIds(new Set(favs.map(f => f.prompt_id)));
        }
      }
    };
    fetchData();
  }, []);

  // FAQ Schema for Gemini prompts
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best Gemini prompts for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best Gemini prompts for coding leverage its multimodal capabilities. Gemini excels at analyzing code screenshots, understanding complex codebases, and generating code with detailed context. Use structured prompts that specify language, framework, and expected output."
          }
        },
        {
          "@type": "Question",
          "name": "How is Gemini different from ChatGPT for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gemini offers native multimodal understanding, allowing you to share code screenshots and diagrams. It has a larger context window than GPT-4, making it better for analyzing entire codebases. Gemini also integrates directly with Google Cloud and Android Studio."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use Gemini for free for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Gemini offers a free tier through Google AI Studio and Bard. Gemini Pro is available for free with rate limits. For production use, Gemini API pricing is competitive with other AI coding assistants."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use Gemini in Android Studio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gemini is integrated into Android Studio through Studio Bot. You can ask it to generate code, explain existing code, fix bugs, and write tests. Our prompts are optimized for Android development workflows."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-gemini-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Google Gemini Prompts</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best Gemini AI Prompts for Coding 2025
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Copy-paste ready Google Gemini prompts for code generation, debugging, and analysis. 
            Optimized for Gemini Pro, Gemini Ultra & Android Studio.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link to="/browse?search=android" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Android
            </Link>
            <Link to="/browse?search=kotlin" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Kotlin
            </Link>
            <Link to="/browse?search=python" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Python
            </Link>
            <Link to="/browse?search=flutter" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Flutter
            </Link>
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Gemini AI Coding Prompts</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading prompts...</div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No prompts found</div>
          ) : (
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
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Gemini Coding FAQ</h2>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What are the best Gemini prompts for coding?</h3>
              <p className="text-muted-foreground">The best Gemini prompts leverage its multimodal capabilities. Gemini excels at analyzing code screenshots, understanding complex codebases, and generating code with detailed context.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">How is Gemini different from ChatGPT for coding?</h3>
              <p className="text-muted-foreground">Gemini offers native multimodal understanding, a larger context window, and integrates directly with Google Cloud and Android Studio.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Can I use Gemini for free for coding?</h3>
              <p className="text-muted-foreground">Yes! Gemini offers a free tier through Google AI Studio. Gemini Pro is available for free with rate limits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6">Explore More AI Coding Prompts</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/chatgpt-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              ChatGPT Prompts
            </Link>
            <Link to="/cursor-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              Cursor AI Prompts
            </Link>
            <Link to="/claude-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              Claude Prompts
            </Link>
            <Link to="/github-copilot-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              GitHub Copilot Prompts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeminiPrompts;
