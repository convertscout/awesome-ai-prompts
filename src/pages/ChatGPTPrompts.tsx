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

const ChatGPTPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'Best ChatGPT Prompts for Coding 2025 - AI Code Generator Prompts',
    description: 'Copy-paste ready ChatGPT prompts for coding. 50+ proven prompts to generate code, debug errors, write tests, and refactor. Free ChatGPT coding prompts for developers.',
    canonical: 'https://lovabledirectory.site/chatgpt-prompts',
    keywords: ['ChatGPT prompts for coding', 'ChatGPT coding prompts', 'best ChatGPT prompts for developers', 'AI code generator', 'ChatGPT programming prompts'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'ChatGPT Prompts', url: 'https://lovabledirectory.site/chatgpt-prompts' }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch prompts that work with ChatGPT/OpenAI
      const { data, error } = await supabase
        .from("prompts")
        .select("id, slug, title, description, category, tags, views_count, favorites_count")
        .order("favorites_count", { ascending: false })
        .limit(50);

      if (data && !error) {
        setPrompts(data);
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

  // FAQ Schema for ChatGPT prompts
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best ChatGPT prompts for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best ChatGPT prompts for coding include structured prompts for code generation, debugging, refactoring, and test writing. Effective prompts specify the programming language, framework, and desired output format."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use ChatGPT to write code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To use ChatGPT for coding: 1) Be specific about the programming language and framework, 2) Describe the functionality you need, 3) Include any constraints or requirements, 4) Ask for explanations if needed. Our prompts are optimized for these best practices."
          }
        },
        {
          "@type": "Question",
          "name": "Can ChatGPT debug my code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! ChatGPT excels at debugging. Paste your code with the error message and ask ChatGPT to identify the bug. Our debugging prompts help you get more accurate results by structuring your request effectively."
          }
        },
        {
          "@type": "Question",
          "name": "Is ChatGPT good for programming in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChatGPT is excellent for programming in 2025, especially with GPT-4. It can generate code, explain concepts, debug errors, write tests, and help with code reviews. It works best when paired with well-crafted prompts."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-chatgpt-faq', 'true');
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
          <Badge variant="secondary" className="mb-4">ChatGPT Coding Prompts</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best ChatGPT Prompts for Coding 2025
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Copy-paste ready ChatGPT prompts to generate code, debug errors, write tests, and refactor. 
            Optimized for GPT-4 and ChatGPT Plus.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link to="/browse?search=python" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              Python
            </Link>
            <Link to="/browse?search=javascript" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              JavaScript
            </Link>
            <Link to="/browse?search=react" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              React
            </Link>
            <Link to="/browse?search=typescript" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
              TypeScript
            </Link>
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">ChatGPT Coding Prompts</h2>
          
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
          <h2 className="text-2xl font-bold mb-8 text-center">ChatGPT Coding FAQ</h2>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What are the best ChatGPT prompts for coding?</h3>
              <p className="text-muted-foreground">The best ChatGPT prompts for coding include structured prompts for code generation, debugging, refactoring, and test writing. Effective prompts specify the programming language, framework, and desired output format.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">How do I use ChatGPT to write code?</h3>
              <p className="text-muted-foreground">Be specific about the programming language and framework, describe the functionality you need, include any constraints or requirements, and ask for explanations if needed.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Can ChatGPT debug my code?</h3>
              <p className="text-muted-foreground">Yes! ChatGPT excels at debugging. Paste your code with the error message and ask ChatGPT to identify the bug. Our debugging prompts help you get more accurate results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6">Explore More AI Coding Prompts</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cursor-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              Cursor AI Prompts
            </Link>
            <Link to="/claude-prompts" className="px-6 py-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              Claude Prompts
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

export default ChatGPTPrompts;
