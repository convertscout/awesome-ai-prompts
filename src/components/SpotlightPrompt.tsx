import { Link } from "react-router-dom";
import { Copy, ArrowRight, Eye, Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SpotlightPromptProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  viewsCount: number;
  favoritesCount: number;
}

export const SpotlightPrompt = ({
  slug,
  title,
  description,
  content,
  viewsCount,
  favoritesCount,
}: SpotlightPromptProps) => {
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Prompt copied to clipboard!");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card/80 p-6 shadow-glow">
      {/* Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">Top Pick</span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 pr-24">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      {/* Code Preview */}
      <div className="relative bg-muted/50 rounded-lg p-4 mb-4 border border-border/50">
        <pre className="text-xs font-mono text-muted-foreground overflow-hidden">
          <code className="line-clamp-4">{content}</code>
        </pre>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {viewsCount} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {favoritesCount} favorites
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Link to={`/prompt/${slug}`}>
            <Button size="sm" className="gap-1.5 text-xs">
              View Full
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
