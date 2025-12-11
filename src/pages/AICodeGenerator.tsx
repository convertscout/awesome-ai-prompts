import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";
import { Badge } from "@/components/ui/badge";
import { Code, Zap, Bot, Sparkles } from "lucide-react";

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

const AICodeGenerator = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'AI Code Generator Prompts 2025 - Generate Code with ChatGPT, Cursor, Claude',
    description: 'Best AI code generator prompts for 2025. Copy-paste ready prompts to generate code with ChatGPT, Cursor AI, Claude, Copilot. Free prompts for Python, JavaScript, React, TypeScript.',
    canonical: 'https://lovabledirectory.site/ai-code-generator',
    keywords: ['AI code generator', 'AI coding assistant', 'generate code with AI', 'AI programming tools', 'code generation prompts'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'AI Code Generator', url: 'https://lovabledirectory.site/ai-code-generator' }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, slug, title, description, category, tags, views_count, favorites_count")
        .order("favorites_count", { ascending: false })
        .limit(30);

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

  // FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best AI code generator in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI code generators in 2025 are ChatGPT (GPT-4), Cursor AI, Claude 3, GitHub Copilot, and Google Gemini. Each excels in different areas: ChatGPT for general coding, Cursor for IDE integration, Claude for complex reasoning, Copilot for code completion."
          }
        },
        {
          "@type": "Question",
          "name": "Can AI write code for me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! AI can write functional code for you. Using well-crafted prompts, AI tools like ChatGPT and Cursor can generate complete functions, components, APIs, and even full applications. Our prompts are optimized to get the best code generation results."
          }
        },
        {
          "@type": "Question",
          "name": "Is AI code generation free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Many AI code generators offer free tiers. ChatGPT has a free version, GitHub Copilot offers free trials, Google Gemini is free in Google AI Studio, and Claude has a free tier. Our prompts work with all these tools."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get AI to generate better code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To get better AI-generated code: 1) Be specific about language and framework, 2) Describe the functionality clearly, 3) Include constraints and requirements, 4) Ask for error handling and edge cases, 5) Request comments and documentation. Our prompts include these best practices."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-codegen-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const tools = [
    { name: 'ChatGPT', icon: Bot, description: 'Best for general code generation', link: '/chatgpt-prompts' },
    { name: 'Cursor AI', icon: Code, description: 'Best IDE-integrated coding', link: '/cursor-prompts' },
    { name: 'Claude', icon: Sparkles, description: 'Best for complex reasoning', link: '/claude-prompts' },
    { name: 'GitHub Copilot', icon: Zap, description: 'Best for code completion', link: '/github-copilot-prompts' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">AI Code Generator</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Code Generator Prompts 2025
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Generate production-ready code with AI. Copy-paste ready prompts for ChatGPT, Cursor, Claude, 
            Copilot & more. Free code generation prompts for every language.
          </p>
        </div>
      </section>

      {/* Tools Comparison */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Best AI Code Generators in 2025</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link 
                key={tool.name} 
                to={tool.link}
                className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <tool.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Code Generation Prompts</h2>
          
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
          <h2 className="text-2xl font-bold mb-8 text-center">AI Code Generator FAQ</h2>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What is the best AI code generator in 2025?</h3>
              <p className="text-muted-foreground">The best AI code generators are ChatGPT (GPT-4), Cursor AI, Claude 3, GitHub Copilot, and Google Gemini. Each excels in different areas.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Can AI write code for me?</h3>
              <p className="text-muted-foreground">Yes! AI can write functional code for you. Using well-crafted prompts, AI tools can generate complete functions, components, APIs, and even full applications.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">How do I get AI to generate better code?</h3>
              <p className="text-muted-foreground">Be specific about language and framework, describe functionality clearly, include constraints, ask for error handling, and request comments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Links */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6">Generate Code by Language</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/browse?search=python" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">Python</Link>
            <Link to="/browse?search=javascript" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">JavaScript</Link>
            <Link to="/browse?search=typescript" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">TypeScript</Link>
            <Link to="/browse?search=react" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">React</Link>
            <Link to="/browse?search=rust" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">Rust</Link>
            <Link to="/browse?search=go" className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80">Go</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AICodeGenerator;
