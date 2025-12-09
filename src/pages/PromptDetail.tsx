import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Eye, Copy, Check, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { RelatedPrompts } from "@/components/RelatedPrompts";

interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
  created_at: string;
  url: string | null;
  content_type: string | null;
  button_text: string | null;
}

const PromptDetail = () => {
  const { slug } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  // Dynamic SEO - uses title and description from database
  useSEO({
    title: prompt ? `${prompt.title} - AI Prompt | Lovable Directory` : 'Loading... | Lovable Directory',
    description: prompt?.description || 'Discover AI prompts for Cursor, Lovable, and GitHub Copilot on Lovable Directory',
    canonical: prompt ? `https://lovable.directory/prompt/${slug}` : undefined,
    ogType: 'article',
    breadcrumbs: prompt ? [
      { name: 'Home', url: 'https://lovable.directory' },
      { name: 'Browse', url: 'https://lovable.directory/browse' },
      { name: prompt.title, url: `https://lovable.directory/prompt/${slug}` },
    ] : undefined,
  });

  // Add JSON-LD Schema for prompt detail
  useEffect(() => {
    if (prompt) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": prompt.title,
        "description": prompt.description,
        "step": [{
          "@type": "HowToStep",
          "text": "Copy the prompt below and paste it into your AI coding tool"
        }],
        "tool": [{
          "@type": "HowToTool",
          "name": "Cursor AI"
        }, {
          "@type": "HowToTool", 
          "name": "Lovable"
        }, {
          "@type": "HowToTool",
          "name": "GitHub Copilot"
        }]
      };

      let scriptTag = document.querySelector('script[data-prompt-schema]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('data-prompt-schema', 'true');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);

      return () => {
        scriptTag?.remove();
      };
    }
  }, [prompt]);

  useEffect(() => {
    if (slug) {
      fetchPrompt();
    }
  }, [slug]);

  const fetchPrompt = async () => {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (data) {
      setPrompt(data);
      incrementViews(data.id);
      checkFavorite(data.id);
    }
  };

  const incrementViews = async (promptId: string) => {
    await supabase.rpc("increment_prompt_views", { prompt_id: promptId });
  };

  const checkFavorite = async (promptId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("prompt_id", promptId)
        .maybeSingle();

      setIsFavorited(!!data);
    }
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt content copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = () => {
    const contentType = prompt?.content_type?.toLowerCase();
    if ((contentType === 'job' || contentType === 'freelance') && prompt?.url) {
      window.open(prompt.url, '_blank', 'noopener,noreferrer');
    } else {
      handleCopy();
    }
  };

  const getButtonText = () => {
    if (prompt?.button_text) return prompt.button_text;
    const contentType = prompt?.content_type?.toLowerCase();
    if ((contentType === 'job' || contentType === 'freelance') && prompt?.url) {
      return 'Apply Now';
    }
    return 'Copy Prompt';
  };

  const handleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to favorite prompts",
        variant: "destructive",
      });
      return;
    }

    if (!prompt) return;

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id);
      setIsFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, prompt_id: prompt.id });
      setIsFavorited(true);
    }

    fetchPrompt();
  };

  const formatCategory = (cat: string) => {
    return cat
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-3xl font-bold">{prompt.title}</h1>
                <p className="text-lg text-muted-foreground">{prompt.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorited ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
                <Button onClick={handleAction} className="bg-gradient-primary hover:opacity-90">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      {getButtonText()}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary/10 text-primary">
                {formatCategory(prompt.category)}
              </Badge>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {prompt.views_count} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {prompt.favorites_count} favorites
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content */}
          <Card className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {prompt.content}
            </pre>
          </Card>

          {/* Related Prompts - Internal Linking */}
          <RelatedPrompts 
            currentPromptId={prompt.id} 
            category={prompt.category} 
            tags={prompt.tags} 
          />
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
