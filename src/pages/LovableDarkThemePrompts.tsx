import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Moon, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

const darkThemeExamples = [
  {
    title: "Full Dark Theme System Prompt",
    prompt: `Build this app with a dark theme by default. Use a color palette based on:
- Background: hsl(222, 47%, 8%) for the main bg
- Card/Surface: hsl(222, 47%, 12%) for cards and elevated surfaces
- Border: hsl(222, 30%, 18%) for subtle borders
- Text: hsl(210, 40%, 96%) for primary text
- Muted text: hsl(215, 20%, 55%) for secondary text
- Primary accent: hsl(262, 83%, 58%) for buttons and links

Use consistent shadow with rgba(0,0,0,0.3). Ensure all text has WCAG AA contrast. No pure black (#000) backgrounds - always use dark navy/slate tones for depth.`,
  },
  {
    title: "Dark Mode Toggle Prompt",
    prompt: `Add a dark mode toggle to my Lovable app. Requirements:
1. Use next-themes or a custom ThemeProvider with localStorage persistence
2. Toggle button in the top nav with Sun/Moon icons
3. Define both light and dark CSS variables in index.css using the shadcn pattern:
   :root { --background: 0 0% 100%; }
   .dark { --background: 222 47% 8%; }
4. Default to dark mode
5. Smooth transition: add "transition-colors duration-300" to the body
6. Ensure all shadcn components respect the theme automatically`,
  },
  {
    title: "Glassmorphism Dark UI Prompt",
    prompt: `Design this interface using dark glassmorphism. Style rules:
- Main background: deep navy gradient (from hsl(222,47%,6%) to hsl(240,30%,12%))
- Cards: backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
- Hover states: bg-white/10 with subtle scale transform
- Text: white with 90% opacity for headings, 60% for body
- Accent: Use a single vibrant color (violet-500 or cyan-400) sparingly for CTAs
- Add subtle grain texture overlay for depth
- No solid backgrounds on any interactive element`,
  },
];

const LovableDarkThemePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useSEO({
    title: "Lovable Dark Theme Prompts 2025 - Dark Mode Examples & Templates | Lovable Directory",
    description: "Copy-paste dark theme prompts for Lovable.dev. Get dark mode, glassmorphism, and dark UI examples that actually work. No more generic light themes.",
    canonical: "https://lovabledirectory.site/lovable-dark-theme-prompts",
    breadcrumbs: [
      { name: "Home", url: "https://lovabledirectory.site" },
      { name: "Lovable Prompts", url: "https://lovabledirectory.site/lovable-prompts" },
      { name: "Dark Theme Prompts", url: "https://lovabledirectory.site/lovable-dark-theme-prompts" },
    ],
  });

  // FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I make Lovable use a dark theme?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Add explicit dark theme instructions in your Lovable prompt. Specify background colors (use dark navy like hsl(222,47%,8%) not pure black), text colors with proper contrast, and card/surface colors. Our copy-paste dark theme prompts give you production-ready results instantly.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best dark mode prompt for Lovable.dev?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The best dark mode prompt specifies exact HSL color values for background, surfaces, borders, and text. Avoid saying just 'make it dark' - instead provide a complete color system. Our Full Dark Theme System Prompt includes tested values that produce professional results.",
          },
        },
        {
          "@type": "Question",
          name: "How do I add a dark mode toggle in Lovable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use our Dark Mode Toggle prompt that sets up next-themes with CSS variables in index.css, a Sun/Moon toggle button, localStorage persistence, and smooth transitions. All shadcn components will automatically respect the theme.",
          },
        },
        {
          "@type": "Question",
          name: "Why does my Lovable dark theme look bad?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Common issues: using pure black (#000) instead of dark navy tones, insufficient contrast on text, and not specifying card/surface colors separately from the background. Our prompts solve all these by providing a complete dark color system with proper depth and contrast.",
          },
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-dark-theme-faq", "true");
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    const fetchDarkPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .or("title.ilike.%dark%,title.ilike.%theme%,title.ilike.%mode%,description.ilike.%dark%,tags.cs.{dark},tags.cs.{theme}")
        .order("views_count", { ascending: false })
        .limit(20);
      if (data) setPrompts(data);
      setLoading(false);
    };
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("favorites").select("prompt_id").eq("user_id", user.id);
        if (data) setFavoriteIds(new Set(data.map((f) => f.prompt_id)));
      }
    };
    fetchDarkPrompts();
    fetchFavorites();
  }, []);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/lovable-prompts" className="hover:text-foreground">Lovable Prompts</Link>
            <span>/</span>
            <span className="text-foreground">Dark Theme Prompts</span>
          </div>

          {/* Hero */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Moon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Lovable Dark Theme Prompts</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Dark Mode Examples & Templates for Lovable.dev
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Stop getting generic light themes. These dark mode prompts give you professional, 
              production-ready dark UIs in Lovable. Copy, paste, and get beautiful dark interfaces instantly.
            </p>
          </div>

          {/* Inline Dark Theme Examples - The Core Value */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Copy-Paste Dark Theme Prompts</h2>
            <div className="space-y-4">
              {darkThemeExamples.map((example, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted/30">
                    <h3 className="font-semibold">{example.title}</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(example.prompt, i)}>
                      {copiedIndex === i ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/10">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">{example.prompt}</pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DB Prompts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">More Dark Theme Prompts</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lovable-ui-prompts">
                  All UI Prompts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <p className="text-center py-12 text-muted-foreground">Loading...</p>
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
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Moon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No dark theme prompts found yet.</p>
                <Button asChild>
                  <Link to="/lovable-prompts">Browse All Lovable Prompts</Link>
                </Button>
              </div>
            )}
          </section>

          {/* FAQ */}
          <section className="border-t border-border pt-8 mt-12">
            <h2 className="text-2xl font-semibold mb-6">Dark Theme FAQ</h2>
            <div className="space-y-6">
              {[
                { q: "How do I make Lovable use a dark theme?", a: "Add explicit dark theme instructions in your prompt. Specify background colors (use dark navy like hsl(222,47%,8%) not pure black), text colors with proper contrast, and card/surface colors. Our copy-paste prompts above give you production-ready results instantly." },
                { q: "Why does my Lovable dark theme look bad?", a: "Common issues: using pure black (#000) instead of dark navy tones, insufficient contrast on text, and not specifying card/surface colors separately from the background. Our prompts solve these with a complete dark color system." },
                { q: "How do I add a dark mode toggle?", a: "Use the Dark Mode Toggle prompt above. It sets up next-themes, CSS variables, a Sun/Moon button, and localStorage persistence. All shadcn components automatically respect the theme." },
                { q: "What colors work best for dark themes in Lovable?", a: "Dark navy (hsl 222, 47%, 8-12%) for backgrounds, slightly lighter shades for cards/surfaces, and a single vibrant accent color (violet or cyan). Avoid pure black and ensure WCAG AA text contrast." },
              ].map((faq, i) => (
                <div key={i} className="p-4 bg-accent/30 rounded-lg">
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-medium mb-4">Explore Lovable Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/lovable-ui-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">UI Prompts</p>
                <p className="text-xs text-muted-foreground">Fix hallucinations</p>
              </Link>
              <Link to="/lovable-to-nextjs" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Lovable → Next.js</p>
                <p className="text-xs text-muted-foreground">Migration tool</p>
              </Link>
              <Link to="/generate" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">Prompt Generator</p>
                <p className="text-xs text-muted-foreground">AI-powered</p>
              </Link>
              <Link to="/lovable-prompts" className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <p className="font-medium text-sm">All Lovable Prompts</p>
                <p className="text-xs text-muted-foreground">Full collection</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LovableDarkThemePrompts;
