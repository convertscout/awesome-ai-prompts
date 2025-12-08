import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface QuickCopyPillsProps {
  prompts: Array<{
    id: string;
    slug: string;
    title: string;
    content?: string;
  }>;
}

export const QuickCopyPills = ({ prompts }: QuickCopyPillsProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (prompt: { id: string; content?: string }) => {
    try {
      let contentToCopy = prompt.content;

      if (!contentToCopy) {
        const { data } = await supabase
          .from("prompts")
          .select("content")
          .eq("id", prompt.id)
          .single();
        contentToCopy = data?.content;
      }

      if (contentToCopy) {
        await navigator.clipboard.writeText(contentToCopy);
        setCopiedId(prompt.id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.slice(0, 8).map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => handleCopy(prompt)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
        >
          {copiedId === prompt.id ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
          <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
            {prompt.title.split(" ").slice(0, 2).join(" ")}
          </span>
        </button>
      ))}
    </div>
  );
};
