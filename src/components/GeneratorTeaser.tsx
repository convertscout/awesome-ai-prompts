import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const TOOLS = [
  { id: "cursor", name: "Cursor", icon: "⚡" },
  { id: "chatgpt", name: "ChatGPT", icon: "🤖" },
  { id: "claude", name: "Claude", icon: "🧠" },
  { id: "copilot", name: "Copilot", icon: "✈️" },
  { id: "lovable", name: "Lovable", icon: "💜" },
  { id: "gemini", name: "Gemini", icon: "✨" },
];

export const GeneratorTeaser = () => {
  const [description, setDescription] = useState("");
  const [selectedTool, setSelectedTool] = useState("cursor");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = () => {
    const params = new URLSearchParams();
    if (description) params.set("description", description);
    if (selectedTool) params.set("tool", selectedTool);

    if (user) {
      navigate(`/generate?${params.toString()}`);
    } else {
      navigate(`/auth?returnTo=/generate?${params.toString()}`);
    }
  };

  return (
    <div className="relative p-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/50 to-primary/5 shadow-lg">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent blur-xl opacity-50 -z-10" />
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Prompt Generator</h2>
          <p className="text-xs text-muted-foreground">
            Free • 3 generations/day for members
          </p>
        </div>
      </div>

      {/* Tool selector pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
              selectedTool === tool.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 border-border hover:border-primary/50"
            }`}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.name}
          </button>
        ))}
      </div>

      {/* Input area */}
      <Textarea
        placeholder="Describe your project... e.g., 'A React e-commerce app with TypeScript, using Tailwind and Supabase'"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[80px] bg-background/50 border-border/50 text-sm resize-none mb-4"
      />

      {/* Generate button */}
      <Button 
        onClick={handleGenerate}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      >
        {user ? (
          <>
            Generate Rules & Prompts
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            Sign Up Free to Generate
            <Sparkles className="h-4 w-4" />
          </>
        )}
      </Button>

      {!user && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          Join 12,000+ developers using our free AI generator
        </p>
      )}
    </div>
  );
};
