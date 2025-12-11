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

const ClaudePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'Best Claude Prompts for Coding 2025 - Anthropic Claude AI Developer Prompts',
    description: 'Copy-paste ready Claude prompts for coding. Proven prompts for Claude 3 Opus, Sonnet & Haiku. Free AI coding prompts optimized for complex reasoning and code analysis.',
    canonical: 'https://lovabledirectory.site/claude-prompts',
    keywords: ['Claude prompts for coding', 'Claude AI developer prompts', 'Anthropic Claude prompts', 'Claude 3 coding', 'Claude Opus prompts'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Claude Prompts', url: 'https://lovabledirectory.site/claude-prompts' }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Claude-related prompts
      const { data, error } = await supabase
        .from("prompts")
        .select("id, slug, title, description, category, tags, views_count, favorites_count")
        .or('title.ilike.%claude%,description.ilike.%claude%,title.ilike.%opus%,tags.cs.{claude}')
        .order("favorites_count", { ascending: false })
        .limit(50);

      if (data && !error) {
        setPrompts(data);
      }
      
      // If no Claude-specific prompts, show general prompts
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

  // FAQ Schema for Claude prompts
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best Claude prompts for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best Claude prompts for coding leverage its strong reasoning capabilities. Claude excels at complex code analysis, explaining algorithms, architectural decisions, and maintaining context across long conversations. Use detailed prompts that ask Claude to think step-by-step."
          }
        },
        {
          "@type": "Question",
          "name": "Is Claude better than ChatGPT for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Claude and ChatGPT have different strengths. Claude excels at complex reasoning, following nuanced instructions, and maintaining context. ChatGPT is often faster and has more integrations. For complex refactoring and code review, Claude often produces more thorough results."
          }
        },
        {
          "@type": "Question",
          "name": "What is Claude 3 Opus best for in coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Claude 3 Opus is best for complex coding tasks requiring deep reasoning: architectural decisions, security audits, performance optimization, and understanding legacy codebases. It handles nuanced requirements better than faster models."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get the best coding results from Claude?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For best results: 1) Provide full context including file structure, 2) Ask Claude to think through the problem step-by-step, 3) Request explanations for its choices, 4) Use the appropriate model - Opus for complex tasks, Sonnet for balanced speed/quality."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-claude-faq', 'true');
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
          <Badge variant="secondary" className="mb-4">Anthropic Claude Prompts</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best Claude Prompts for Coding 2025
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Copy-paste ready Claude prompts for complex code analysis, refactoring, and architecture. 
            Optimized for Claude 3 Opus, Sonnet & Haiku.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link to="/browse?search=typescript" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              TypeScript
            </Link>
            <Link to="/browse?search=python" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Python
            </Link>
            <Link to="/browse?search=react" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              React
            </Link>
            <Link to="/browse?search=rust" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Rust
            </Link>
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Claude AI Coding Prompts</h2>
          
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
          <h2 className="text-2xl font-bold mb-8 text-center">Claude Coding FAQ</h2>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What are the best Claude prompts for coding?</h3>
              <p className="text-muted-foreground">The best Claude prompts leverage its strong reasoning capabilities. Claude excels at complex code analysis, explaining algorithms, and maintaining context across long conversations.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Is Claude better than ChatGPT for coding?</h3>
              <p className="text-muted-foreground">Claude and ChatGPT have different strengths. Claude excels at complex reasoning and following nuanced instructions. For complex refactoring and code review, Claude often produces more thorough results.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What is Claude 3 Opus best for in coding?</h3>
              <p className="text-muted-foreground">Claude 3 Opus is best for complex coding tasks requiring deep reasoning: architectural decisions, security audits, performance optimization, and understanding legacy codebases.</p>
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
            <Link to="/gemini-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              Gemini Prompts
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

export default ClaudePrompts;
