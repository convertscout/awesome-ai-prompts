import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, FileText, Layers, Scissors, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const TextChunking = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'Text Chunking for AI 2025 - RAG, Embeddings & Vector Search Guide',
    description: 'Master text chunking strategies for AI applications. Learn fixed, semantic, and recursive chunking for RAG systems, vector databases, and embeddings. Free prompts included.',
    canonical: 'https://lovabledirectory.site/text-chunking',
    keywords: ['text chunking', 'text chunking for RAG', 'AI text chunking', 'chunking strategies', 'vector embeddings', 'semantic chunking'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Text Chunking', url: 'https://lovabledirectory.site/text-chunking' }
    ]
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%chunk%,title.ilike.%RAG%,title.ilike.%embed%,description.ilike.%vector%,tags.cs.{rag}')
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
          "name": "What is text chunking in AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Text chunking is the process of splitting large documents into smaller, meaningful segments for AI processing. It's essential for RAG (Retrieval-Augmented Generation) systems, vector databases, and embedding models that have token limits."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best chunking strategy for RAG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best chunking strategy depends on your content. Semantic chunking works best for narrative content, fixed-size chunking for uniform data, and recursive chunking for structured documents. Most RAG systems use 500-1000 token chunks with 50-100 token overlap."
          }
        },
        {
          "@type": "Question",
          "name": "What is the ideal chunk size for embeddings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For most embedding models like OpenAI ada-002 or Cohere, 256-512 tokens per chunk works well. Larger chunks (up to 1000 tokens) preserve more context but may dilute semantic meaning. Smaller chunks (128-256) are better for precise retrieval."
          }
        },
        {
          "@type": "Question",
          "name": "How does chunk overlap work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chunk overlap means including some text from the previous chunk in the next one. This prevents information loss at chunk boundaries. Typical overlap is 10-20% of chunk size (e.g., 100 token overlap for 500 token chunks)."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-chunking-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const chunkingStrategies = [
    {
      name: "Fixed-Size Chunking",
      icon: Layers,
      description: "Split text into equal-sized chunks based on character or token count.",
      bestFor: "Uniform data, simple implementations",
      pros: ["Simple to implement", "Predictable chunk sizes", "Fast processing"],
      cons: ["May split mid-sentence", "No semantic awareness"]
    },
    {
      name: "Semantic Chunking",
      icon: FileText,
      description: "Split at natural boundaries like paragraphs, sentences, or topics.",
      bestFor: "Narrative content, articles, documentation",
      pros: ["Preserves meaning", "Better retrieval quality", "Natural boundaries"],
      cons: ["Variable chunk sizes", "More complex logic"]
    },
    {
      name: "Recursive Chunking",
      icon: Scissors,
      description: "Hierarchically split using multiple separators (paragraphs → sentences → words).",
      bestFor: "Mixed content, code, structured docs",
      pros: ["Flexible", "Handles varied content", "Good for code"],
      cons: ["Complex implementation", "Needs tuning"]
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
              <span className="text-foreground">Text Chunking</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scissors className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">AI Guide</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">Text Chunking for AI: Complete Guide 2025</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
              Master text chunking strategies for RAG systems, vector databases, and AI embeddings. 
              Learn fixed, semantic, and recursive chunking with practical examples and prompts.
            </p>
          </div>

          {/* Chunking Strategies */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Text Chunking Strategies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {chunkingStrategies.map((strategy) => (
                <div key={strategy.name} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <strategy.icon className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">{strategy.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                  <p className="text-xs mb-3"><span className="font-semibold">Best for:</span> {strategy.bestFor}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-green-500">Pros</p>
                      <ul className="text-xs text-muted-foreground">
                        {strategy.pros.map((pro) => (
                          <li key={pro}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-500">Cons</p>
                      <ul className="text-xs text-muted-foreground">
                        {strategy.cons.map((con) => (
                          <li key={con}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chunk Size Guide */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Optimal Chunk Sizes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <Database className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Vector Search</h3>
                <p className="text-2xl font-bold text-primary">256-512</p>
                <p className="text-xs text-muted-foreground">tokens per chunk</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <FileText className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">RAG Systems</h3>
                <p className="text-2xl font-bold text-primary">500-1000</p>
                <p className="text-xs text-muted-foreground">tokens per chunk</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <Layers className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Overlap</h3>
                <p className="text-2xl font-bold text-primary">10-20%</p>
                <p className="text-xs text-muted-foreground">of chunk size</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <Scissors className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Q&A Bots</h3>
                <p className="text-2xl font-bold text-primary">200-400</p>
                <p className="text-xs text-muted-foreground">tokens per chunk</p>
              </div>
            </div>
          </section>

          {/* Code Example */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Python Example: Recursive Chunking</h2>
            <div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-muted-foreground">
{`from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)

chunks = text_splitter.split_text(document)
# Each chunk is now ~500 chars with 50 char overlap`}
              </pre>
            </div>
          </section>

          {/* Related Prompts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">RAG & Embedding Prompts</h2>
              <Button variant="outline" asChild>
                <Link to="/browse?search=rag">
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
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">RAG prompts coming soon!</p>
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
                <h3 className="font-medium mb-2">What is text chunking in AI?</h3>
                <p className="text-muted-foreground text-sm">
                  Text chunking is the process of splitting large documents into smaller, meaningful 
                  segments for AI processing. It's essential for RAG systems, vector databases, 
                  and embedding models that have token limits.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">What is the best chunking strategy for RAG?</h3>
                <p className="text-muted-foreground text-sm">
                  The best strategy depends on your content. Semantic chunking works best for 
                  narrative content, fixed-size for uniform data, and recursive for structured 
                  documents. Most RAG systems use 500-1000 token chunks with 50-100 token overlap.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">How does chunk overlap work?</h3>
                <p className="text-muted-foreground text-sm">
                  Chunk overlap means including some text from the previous chunk in the next one. 
                  This prevents information loss at chunk boundaries. Typical overlap is 10-20% 
                  of chunk size (e.g., 100 token overlap for 500 token chunks).
                </p>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Related Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/cursor-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Cursor Prompts</p>
                <p className="text-xs text-muted-foreground">IDE integration</p>
              </Link>
              <Link to="/best-ai-for-coding" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Best AI for Coding</p>
                <p className="text-xs text-muted-foreground">Tool comparison</p>
              </Link>
              <Link to="/mcp-directory" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">MCP Directory</p>
                <p className="text-xs text-muted-foreground">Context protocols</p>
              </Link>
              <Link to="/browse?search=python" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Python Prompts</p>
                <p className="text-xs text-muted-foreground">ML & Data</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TextChunking;
