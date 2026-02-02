import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Plug, Zap, Database, GitBranch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
  content_type: string;
}

const MCPDirectory = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useSEO({
    title: 'MCP Directory 2025 - Model Context Protocol for Cursor & AI Tools',
    description: 'Explore MCP (Model Context Protocol) integrations for Cursor, Claude, and AI coding tools. Find n8n, Encore, and custom MCP configurations. Free prompts and setup guides.',
    canonical: 'https://lovabledirectory.site/mcp-directory',
    keywords: ['mcp cursor', 'model context protocol', 'encore mcp cursor', 'n8n mcp', 'mcp integrations', 'cursor mcp setup'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'MCP Directory', url: 'https://lovabledirectory.site/mcp-directory' }
    ]
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%mcp%,description.ilike.%mcp%,content_type.eq.mcp,tags.cs.{mcp}')
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

  // FAQ Schema for rich snippets
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is MCP (Model Context Protocol)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MCP (Model Context Protocol) is an open standard that enables AI models like Claude and Cursor to securely connect to external data sources and tools. It allows AI assistants to access databases, APIs, and services while maintaining security boundaries."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use MCP with Cursor IDE?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To use MCP with Cursor, add MCP server configurations to your .cursor/mcp.json file. Cursor supports MCP servers for databases, APIs, file systems, and custom integrations. Each server runs as a separate process that Cursor communicates with."
          }
        },
        {
          "@type": "Question",
          "name": "What is Encore MCP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Encore MCP is an MCP server that connects AI tools to Encore.dev backend services. It allows Cursor and Claude to understand your Encore APIs, databases, and services, enabling AI-powered backend development."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use MCP with n8n?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! n8n has MCP support that allows AI assistants to interact with n8n workflows. You can trigger workflows, read data, and automate tasks through AI tools like Cursor using the n8n MCP server."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-mcp-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mcpCategories = [
    {
      name: "Database MCPs",
      icon: Database,
      description: "Connect AI to PostgreSQL, Supabase, MongoDB, and more",
      examples: ["Supabase MCP", "PostgreSQL MCP", "SQLite MCP"]
    },
    {
      name: "Workflow MCPs",
      icon: GitBranch,
      description: "Integrate with n8n, Zapier, and automation tools",
      examples: ["n8n MCP", "Make MCP", "Workflow Automation"]
    },
    {
      name: "API MCPs",
      icon: Plug,
      description: "Connect to REST APIs, GraphQL, and services",
      examples: ["Encore MCP", "REST API MCP", "GraphQL MCP"]
    },
    {
      name: "Development MCPs",
      icon: Zap,
      description: "GitHub, Git, file system, and dev tool integrations",
      examples: ["GitHub MCP", "File System MCP", "Git MCP"]
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
              <span className="text-foreground">MCP Directory</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Plug className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Model Context Protocol</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">MCP Directory: Context Protocols for AI Tools</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore MCP integrations for Cursor, Claude, and AI coding tools. 
              Connect your AI assistant to databases, APIs, workflows, and services.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search MCP integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* What is MCP */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What is MCP?</h2>
            <p className="text-muted-foreground mb-6">
              Model Context Protocol (MCP) is an open standard developed by Anthropic that enables 
              AI models to securely connect to external data sources and tools. It creates a universal 
              interface for AI assistants like Claude and Cursor to interact with databases, APIs, 
              file systems, and services.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Open Standard</Badge>
              <Badge variant="outline">Secure Connections</Badge>
              <Badge variant="outline">Universal Interface</Badge>
              <Badge variant="outline">Tool Agnostic</Badge>
            </div>
          </section>

          {/* MCP Categories */}
          <section>
            <h2 className="text-2xl font-bold mb-6">MCP Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mcpCategories.map((category) => (
                <div key={category.name} className="bg-card border border-border rounded-lg p-6">
                  <category.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example) => (
                      <Badge key={example} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular MCPs */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Popular MCP Integrations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🔷 Encore MCP</h3>
                <p className="text-sm text-muted-foreground">
                  Connect Cursor to Encore.dev backends. AI understands your APIs, 
                  databases, and services for intelligent backend development.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔶 n8n MCP</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate n8n workflows with AI tools. Trigger automations, 
                  read workflow data, and build AI-powered automation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🟢 Supabase MCP</h3>
                <p className="text-sm text-muted-foreground">
                  Give AI direct access to your Supabase database. Query data, 
                  understand schema, and generate accurate SQL.
                </p>
              </div>
            </div>
          </section>

          {/* MCP Prompts Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                MCP Configurations & Prompts
                {searchQuery && <span className="text-muted-foreground font-normal text-lg ml-2">({filteredPrompts.length} results)</span>}
              </h2>
              <Button variant="outline" asChild>
                <Link to="/browse?type=mcp">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading MCP configurations...</p>
              </div>
            ) : filteredPrompts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.map((prompt) => (
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
                <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? `No MCPs matching "${searchQuery}"` : "MCP configurations loading..."}
                </p>
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
                <h3 className="font-medium mb-2">What is MCP (Model Context Protocol)?</h3>
                <p className="text-muted-foreground text-sm">
                  MCP is an open standard that enables AI models like Claude and Cursor to securely 
                  connect to external data sources and tools. It allows AI assistants to access 
                  databases, APIs, and services while maintaining security boundaries.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">How do I use MCP with Cursor IDE?</h3>
                <p className="text-muted-foreground text-sm">
                  Add MCP server configurations to your .cursor/mcp.json file. Cursor supports 
                  MCP servers for databases, APIs, file systems, and custom integrations. 
                  Each server runs as a separate process that Cursor communicates with.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">What is Encore MCP?</h3>
                <p className="text-muted-foreground text-sm">
                  Encore MCP is an MCP server that connects AI tools to Encore.dev backend services. 
                  It allows Cursor and Claude to understand your Encore APIs, databases, and services, 
                  enabling AI-powered backend development.
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
                <p className="text-xs text-muted-foreground">IDE rules</p>
              </Link>
              <Link to="/cursor-superwhisper-integration" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">SuperWhisper</p>
                <p className="text-xs text-muted-foreground">Voice coding</p>
              </Link>
              <Link to="/best-ai-for-coding" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Best AI for Coding</p>
                <p className="text-xs text-muted-foreground">Tool comparison</p>
              </Link>
              <Link to="/browse" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Browse All</p>
                <p className="text-xs text-muted-foreground">All prompts</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MCPDirectory;
