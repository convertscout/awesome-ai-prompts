import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Mic, Zap, Settings, CheckCircle, Terminal } from "lucide-react";
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

const CursorSuperWhisperIntegration = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useSEO({
    title: 'Cursor + SuperWhisper Integration Guide 2025 - Voice Coding Setup',
    description: 'Set up SuperWhisper with Cursor IDE for voice-powered coding. Step-by-step guide for transcription integration, voice commands, and hands-free development.',
    canonical: 'https://lovabledirectory.site/cursor-superwhisper-integration',
    keywords: ['cursor superwhisper integration', 'cursor ide superwhisper', 'voice coding cursor', 'superwhisper transcription', 'hands-free coding'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Cursor Prompts', url: 'https://lovabledirectory.site/cursor-prompts' },
      { name: 'SuperWhisper Integration', url: 'https://lovabledirectory.site/cursor-superwhisper-integration' }
    ]
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or('title.ilike.%cursor%,tags.cs.{cursor}')
        .order("favorites_count", { ascending: false })
        .limit(6);

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
          "name": "What is SuperWhisper?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SuperWhisper is a macOS app that provides fast, accurate voice-to-text transcription using OpenAI's Whisper model. It runs locally for privacy and integrates with any text input, including Cursor IDE."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use SuperWhisper with Cursor IDE?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Install SuperWhisper, configure your hotkey (default: Option key hold), then use it in Cursor by holding the hotkey and speaking. The transcribed text appears directly in Cursor's chat or editor."
          }
        },
        {
          "@type": "Question",
          "name": "Is SuperWhisper free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SuperWhisper offers a free trial with limited usage. The paid version starts at $8/month and includes unlimited transcription, all Whisper models, and priority support."
          }
        },
        {
          "@type": "Question",
          "name": "Does SuperWhisper work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! SuperWhisper runs Whisper models locally on your Mac, so transcription works without internet. This also means your voice data stays private and never leaves your device."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-superwhisper-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const setupSteps = [
    {
      step: 1,
      title: "Install SuperWhisper",
      description: "Download SuperWhisper from superwhisper.com. It requires macOS 13+ and an Apple Silicon or Intel Mac.",
      icon: Terminal
    },
    {
      step: 2,
      title: "Configure Hotkey",
      description: "Open SuperWhisper settings and set your activation hotkey. Default is holding the Option key.",
      icon: Settings
    },
    {
      step: 3,
      title: "Select Whisper Model",
      description: "Choose your Whisper model. 'Large' for accuracy, 'Medium' for speed, or 'Turbo' for balanced performance.",
      icon: Zap
    },
    {
      step: 4,
      title: "Open Cursor IDE",
      description: "Launch Cursor and open any file or the AI chat panel where you want to use voice input.",
      icon: Terminal
    },
    {
      step: 5,
      title: "Start Dictating",
      description: "Hold your hotkey and speak. SuperWhisper transcribes your voice and types directly into Cursor.",
      icon: Mic
    },
    {
      step: 6,
      title: "Use with AI Chat",
      description: "Dictate prompts to Cursor's AI assistant. Say 'create a React component for...' and it appears in the chat.",
      icon: CheckCircle
    }
  ];

  const voiceCommands = [
    { command: "Create a function that...", description: "Dictate function requirements to AI" },
    { command: "Refactor this to use...", description: "Voice-guided refactoring" },
    { command: "Add error handling for...", description: "Quick error handling additions" },
    { command: "Write tests for...", description: "Generate tests by voice" },
    { command: "Explain what this code does", description: "Get code explanations hands-free" },
    { command: "Fix the bug where...", description: "Describe bugs verbally" }
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
              <Link to="/cursor-prompts" className="hover:text-foreground">Cursor Prompts</Link>
              <span>/</span>
              <span className="text-foreground">SuperWhisper Integration</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Integration Guide</Badge>
                <h1 className="text-3xl md:text-4xl font-bold">Cursor + SuperWhisper Integration Guide</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
              Set up voice-powered coding with SuperWhisper and Cursor IDE. 
              Dictate code, prompts, and commands hands-free with local AI transcription.
            </p>
          </div>

          {/* What is SuperWhisper */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What is SuperWhisper?</h2>
            <p className="text-muted-foreground mb-6">
              SuperWhisper is a macOS application that provides fast, accurate voice-to-text transcription 
              using OpenAI's Whisper model. It runs entirely locally on your device, ensuring privacy 
              while delivering professional-grade transcription speeds.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <Zap className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Fast Transcription</h3>
                <p className="text-xs text-muted-foreground">Real-time voice to text, faster than typing</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <Settings className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Local Processing</h3>
                <p className="text-xs text-muted-foreground">Runs on your Mac, no cloud required</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <Terminal className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Any App Integration</h3>
                <p className="text-xs text-muted-foreground">Works with Cursor, VS Code, browsers, etc.</p>
              </div>
            </div>
          </section>

          {/* Setup Steps */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Step-by-Step Setup</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {setupSteps.map((item) => (
                <div key={item.step} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </span>
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Voice Commands */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Voice Commands for Cursor AI</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {voiceCommands.map((item) => (
                <div key={item.command} className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
                  <Mic className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-sm text-foreground">"{item.command}"</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Pro Tips for Voice Coding</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Speak in complete thoughts</h3>
                  <p className="text-sm text-muted-foreground">Instead of "create a... um... function", say the full request at once.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Use technical terms clearly</h3>
                  <p className="text-sm text-muted-foreground">SuperWhisper handles "useState", "async/await", and code terms well.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Combine with keyboard shortcuts</h3>
                  <p className="text-sm text-muted-foreground">Voice for prompts, keyboard for navigation and edits.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Cursor Prompts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Cursor Prompts</h2>
              <Button variant="outline" asChild>
                <Link to="/cursor-prompts">
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
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Cursor prompts loading...</p>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">What is SuperWhisper?</h3>
                <p className="text-muted-foreground text-sm">
                  SuperWhisper is a macOS app that provides fast, accurate voice-to-text transcription 
                  using OpenAI's Whisper model. It runs locally for privacy and integrates with any 
                  text input, including Cursor IDE.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Is SuperWhisper free?</h3>
                <p className="text-muted-foreground text-sm">
                  SuperWhisper offers a free trial with limited usage. The paid version starts at 
                  $8/month and includes unlimited transcription, all Whisper models, and priority support.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Does SuperWhisper work offline?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! SuperWhisper runs Whisper models locally on your Mac, so transcription works 
                  without internet. This also means your voice data stays private.
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
                <p className="text-xs text-muted-foreground">All Cursor rules</p>
              </Link>
              <Link to="/mcp-directory" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">MCP Directory</p>
                <p className="text-xs text-muted-foreground">Context protocols</p>
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

export default CursorSuperWhisperIntegration;
