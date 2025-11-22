import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flame } from "lucide-react";

interface TrendingPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
  language?: string;
  framework?: string;
}

const Trending = () => {
  const [trendingPrompts, setTrendingPrompts] = useState<TrendingPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      // First calculate trending scores
      await supabase.rpc("calculate_trending_score");

      // Then fetch the trending prompts
      const { data: trendingData } = await supabase
        .from("trending_items")
        .select(`
          prompt_id,
          trending_score,
          prompts (*)
        `)
        .order("trending_score", { ascending: false })
        .limit(20);

      if (trendingData) {
        const prompts = trendingData
          .map((item: any) => item.prompts)
          .filter(Boolean);
        setTrendingPrompts(prompts);
      }
      setLoading(false);
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">What's Trending</h1>
              <p className="text-muted-foreground mt-1">
                Popular prompts and resources in the Lovable community
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading trending items...</p>
            </div>
          ) : trendingPrompts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category}
                  tags={prompt.tags}
                  viewsCount={prompt.views_count}
                  favoritesCount={prompt.favorites_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No trending items yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
