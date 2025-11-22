import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  viewsCount: number;
  favoritesCount: number;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export const PromptCard = ({
  id,
  title,
  description,
  category,
  tags,
  viewsCount,
  favoritesCount,
  isFavorited = false,
  onFavoriteToggle,
}: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data } = await supabase
      .from("prompts")
      .select("content")
      .eq("id", id)
      .single();

    if (data) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt content copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to favorite prompts",
          variant: "destructive",
        });
        return;
      }

      if (isFavorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", id);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, prompt_id: id });
      }

      onFavoriteToggle?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCategory = (cat: string) => {
    return cat
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Link to={`/prompt/${id}`}>
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={handleFavorite}
              disabled={isLoading}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {formatCategory(category)}
            </Badge>
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {viewsCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {favoritesCount}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
