import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Sparkles, Copy, Check, Loader2, FileText, Code, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOOLS = [
  { id: "cursor", name: "Cursor", icon: "⚡" },
  { id: "windsurf", name: "Windsurf", icon: "🏄" },
  { id: "chatgpt", name: "ChatGPT", icon: "🤖" },
  { id: "claude", name: "Claude", icon: "🧠" },
  { id: "copilot", name: "GitHub Copilot", icon: "✈️" },
  { id: "lovable", name: "Lovable", icon: "💜" },
  { id: "gemini", name: "Gemini", icon: "✨" },
];

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C#", "PHP", "Ruby", "Swift", "Kotlin"
];

const FRAMEWORKS = [
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "FastAPI", "Django", "Rails", "Spring Boot", "Laravel"
];

const OUTPUT_TYPES = [
  { id: "rules", name: "Rules File", icon: FileText, description: ".cursorrules, .windsurfrules" },
  { id: "system_prompt", name: "System Prompt", icon: Settings, description: "AI assistant persona" },
  { id: "coding_instructions", name: "Coding Instructions", icon: Code, description: "Detailed guidelines" },
];

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  
  // Form state
  const [tool, setTool] = useState(searchParams.get("tool") || "cursor");
  const [language, setLanguage] = useState("TypeScript");
  const [framework, setFramework] = useState("React");
  const [outputType, setOutputType] = useState("rules");
  const [description, setDescription] = useState(searchParams.get("description") || "");
  const [generatedContent, setGeneratedContent] = useState("");

  // SEO
  useSEO({
    title: "Free AI Prompt Generator - Cursor Rules, System Prompts | Lovable Directory",
    description: "Generate AI coding prompts, Cursor rules files, and system prompts for free. 3 generations/day. Works with ChatGPT, Claude, Copilot, Gemini & more.",
    canonical: "https://lovabledirectory.site/generate",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "https://lovabledirectory.site/" },
      { name: "AI Generator", url: "https://lovabledirectory.site/generate" },
    ],
  });

  // Add FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an AI prompt generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An AI prompt generator creates optimized instructions for AI coding assistants like Cursor, ChatGPT, Claude, and GitHub Copilot. It helps developers get better results by generating well-structured prompts, rules files, and system prompts tailored to specific projects."
          }
        },
        {
          "@type": "Question",
          "name": "How do I create Cursor rules?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our free AI generator to create .cursorrules files. Simply describe your project, select your language and framework, and click Generate. The tool creates production-ready rules optimized for Cursor AI."
          }
        },
        {
          "@type": "Question",
          "name": "Is the AI prompt generator free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our AI prompt generator is free for registered members. You get 3 free generations per day. Sign up takes seconds and unlocks powerful AI-generated prompts for any coding tool."
          }
        },
        {
          "@type": "Question",
          "name": "Which AI tools are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We support all major AI coding tools including Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, Lovable, and Windsurf. Generate optimized prompts for any of these assistants."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-generator-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate(`/auth?returnTo=/generate`);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch remaining generations
  useEffect(() => {
    const fetchRemaining = async () => {
      if (!user) return;
      
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('generation_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('generated_at', `${today}T00:00:00Z`);
      
      setRemaining(3 - (count || 0));
    };

    fetchRemaining();
  }, [user, generatedContent]);

  const handleGenerate = async () => {
    if (!user) {
      navigate(`/auth?returnTo=/generate`);
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe your project to generate prompts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            tool,
            language,
            framework,
            promptType: outputType,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Generation failed');
      }

      setGeneratedContent(data.content);
      setRemaining(data.remaining);
      
      toast({
        title: "Generated!",
        description: data.message,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Free AI Generator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            AI Prompt & Rules Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate Cursor rules, system prompts & coding instructions in seconds. 
            Optimized for {TOOLS.find(t => t.id === tool)?.name || 'your favorite AI tool'}.
          </p>
        </div>

        {/* Usage indicator */}
        {remaining !== null && (
          <div className="flex justify-center mb-8">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              remaining > 0 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              {remaining > 0 
                ? `${remaining} generation${remaining !== 1 ? 's' : ''} remaining today`
                : 'Daily limit reached • Resets at midnight'}
            </div>
          </div>
        )}

        {/* Generator Form */}
        <div className="space-y-6 mb-8">
          {/* Step 1: Tool Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">1. Choose AI Tool</label>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    tool === t.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <span className="mr-2">{t.icon}</span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Language & Framework */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">2. Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Framework</label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRAMEWORKS.map((fw) => (
                    <SelectItem key={fw} value={fw}>{fw}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Step 3: Output Type */}
          <div>
            <label className="block text-sm font-medium mb-3">3. Output Type</label>
            <div className="grid md:grid-cols-3 gap-3">
              {OUTPUT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setOutputType(type.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    outputType === type.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <type.icon className={`h-5 w-5 mb-2 ${outputType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Description */}
          <div>
            <label className="block text-sm font-medium mb-2">4. Describe Your Project</label>
            <Textarea
              placeholder="E.g., 'A SaaS dashboard with authentication, dark mode, real-time notifications, and Stripe integration. Following clean architecture patterns.'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-card"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading || remaining === 0}
            className="w-full h-12 text-base"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate {OUTPUT_TYPES.find(t => t.id === outputType)?.name}
              </>
            )}
          </Button>
        </div>

        {/* Output Section */}
        {generatedContent && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <span className="text-sm font-medium">Generated Output</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto bg-card max-h-[500px] overflow-y-auto">
              <code className="text-foreground whitespace-pre-wrap">{generatedContent}</code>
            </pre>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">What is an AI prompt generator?</h3>
              <p className="text-muted-foreground text-sm">
                An AI prompt generator creates optimized instructions for AI coding assistants like Cursor, ChatGPT, Claude, and GitHub Copilot. It helps developers get better results by generating well-structured prompts tailored to specific projects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I create Cursor rules?</h3>
              <p className="text-muted-foreground text-sm">
                Simply describe your project above, select Cursor as your tool, choose "Rules File" as output type, and click Generate. You'll get a production-ready .cursorrules file instantly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is the generator completely free?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Registered members get 3 free generations per day. Sign up is free and takes just a few seconds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Which AI tools are supported?</h3>
              <p className="text-muted-foreground text-sm">
                We support Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, Lovable, and Windsurf. The generator optimizes output for each tool's specific format.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Generate;
