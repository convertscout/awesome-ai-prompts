import { Navigation } from "@/components/Navigation";
import { PromptCard } from "@/components/PromptCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
}

const categories = [
  "All",
  "UI/UX",
  "Components",
  "Integrations",
  "Best Practices",
  "Animations",
  "Forms",
  "Layouts",
  "Data Visualization",
  "Authentication",
  "Performance",
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPrompts();
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchQuery, selectedCategory]);

  const fetchPrompts = async () => {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPrompts(data);
    }
  };

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select("prompt_id")
        .eq("user_id", user.id);

      if (data) {
        setFavoriteIds(new Set(data.map((f) => f.prompt_id)));
      }
    }
  };

  const filterPrompts = () => {
    let filtered = prompts;

    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== "All") {
      const categoryKey = selectedCategory.toLowerCase().replace(/\//g, "_").replace(/ /g, "_");
      filtered = filtered.filter((prompt) => prompt.category === categoryKey);
    }

    setFilteredPrompts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gradient-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Results */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredPrompts.length} prompts found
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category}
                  tags={prompt.tags}
                  viewsCount={prompt.views_count}
                  favoritesCount={prompt.favorites_count}
                  isFavorited={favoriteIds.has(prompt.id)}
                  onFavoriteToggle={() => {
                    fetchFavorites();
                    fetchPrompts();
                  }}
                />
              ))}
            </div>

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No prompts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
