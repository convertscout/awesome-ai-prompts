import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  const checkAuthAndFetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchFavorites(user.id);
  };

  const fetchFavorites = async (userId: string) => {
    setIsLoading(true);

    const { data } = await supabase
      .from("favorites")
      .select(`
        prompt_id,
        prompts (
          id,
          title,
          description,
          category,
          tags,
          views_count,
          favorites_count
        )
      `)
      .eq("user_id", userId);

    if (data) {
      const promptsData = data
        .map((fav: any) => fav.prompts)
        .filter(Boolean);
      setFavorites(promptsData);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">
              Prompts you've bookmarked for quick access
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category}
                  tags={prompt.tags}
                  viewsCount={prompt.views_count}
                  favoritesCount={prompt.favorites_count}
                  isFavorited={true}
                  onFavoriteToggle={() => checkAuthAndFetchFavorites()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't favorited any prompts yet.
              </p>
              <a href="/browse" className="text-primary hover:underline">
                Browse prompts
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
