import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface RelatedPrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  views_count: number;
  favorites_count: number;
}

interface RelatedPromptsProps {
  currentPromptId: string;
  category: string;
  tags: string[];
}

export const RelatedPrompts = ({ currentPromptId, category, tags }: RelatedPromptsProps) => {
  const [relatedPrompts, setRelatedPrompts] = useState<RelatedPrompt[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      // Fetch prompts in the same category, excluding current prompt
      const { data } = await supabase
        .from("prompts")
        .select("id, slug, title, description, category, views_count, favorites_count")
        .eq("category", category)
        .neq("id", currentPromptId)
        .order("favorites_count", { ascending: false })
        .limit(4);

      if (data && data.length > 0) {
        setRelatedPrompts(data);
      } else {
        // Fallback: get most popular prompts
        const { data: popularData } = await supabase
          .from("prompts")
          .select("id, slug, title, description, category, views_count, favorites_count")
          .neq("id", currentPromptId)
          .order("views_count", { ascending: false })
          .limit(4);
        
        if (popularData) setRelatedPrompts(popularData);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [currentPromptId, category, tags]);

  if (relatedPrompts.length === 0) return null;

  return (
    <section className="border-t border-border pt-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Related Prompts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedPrompts.map((prompt) => (
          <Link
            key={prompt.id}
            to={`/prompt/${prompt.slug}`}
            className="group p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {prompt.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{prompt.views_count} views</span>
                  <span>{prompt.favorites_count} favorites</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
