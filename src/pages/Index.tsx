import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SponsorCard } from "@/components/SponsorCard";

interface Prompt {
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

const Index = () => {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [memberCount, setMemberCount] = useState(250);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: prompts } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (prompts) setFeaturedPrompts(prompts);
      if (count) setMemberCount(count);
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
  };

  const leftSponsors = [
    [
      { name: "Supabase", description: "Build in a weekend, scale to millions", icon: "⚡", url: "https://supabase.com", bgColor: "hsl(var(--card))" },
      { name: "Vercel", description: "Deploy with zero configuration", icon: "▲", url: "https://vercel.com", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "TailwindCSS", description: "Rapidly build modern websites", icon: "🎨", url: "https://tailwindcss.com", bgColor: "hsl(var(--card))" },
      { name: "Framer Motion", description: "Production-ready animations", icon: "🎬", url: "https://framer.com/motion", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "React Query", description: "Powerful data synchronization", icon: "🔄", url: "https://tanstack.com/query", bgColor: "hsl(var(--card))" },
      { name: "Stripe", description: "Payment infrastructure", icon: "💳", url: "https://stripe.com", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "n8n", description: "Workflow automation tool", icon: "🔗", url: "https://n8n.io", bgColor: "hsl(var(--card))" },
      { name: "Resend", description: "Email for developers", icon: "📧", url: "https://resend.com", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "Clerk", description: "Complete user management", icon: "🔐", url: "https://clerk.com", bgColor: "hsl(var(--card))" },
      { name: "Prisma", description: "Next-generation ORM", icon: "🗄️", url: "https://prisma.io", bgColor: "hsl(var(--card))" }
    ]
  ];

  const rightSponsors = [
    [
      { name: "TypeScript", description: "JavaScript with syntax for types", icon: "📘", url: "https://typescriptlang.org", bgColor: "hsl(var(--card))" },
      { name: "Vite", description: "Next generation frontend tooling", icon: "⚡", url: "https://vitejs.dev", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "Shadcn/ui", description: "Beautifully designed components", icon: "🎯", url: "https://ui.shadcn.com", bgColor: "hsl(var(--card))" },
      { name: "Lucide", description: "Beautiful & consistent icons", icon: "🎨", url: "https://lucide.dev", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "Zod", description: "TypeScript-first schema validation", icon: "✅", url: "https://zod.dev", bgColor: "hsl(var(--card))" },
      { name: "React Router", description: "Declarative routing for React", icon: "🧭", url: "https://reactrouter.com", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "Recharts", description: "Composable charting library", icon: "📊", url: "https://recharts.org", bgColor: "hsl(var(--card))" },
      { name: "Date-fns", description: "Modern JavaScript date utility", icon: "📅", url: "https://date-fns.org", bgColor: "hsl(var(--card))" }
    ],
    [
      { name: "React Hook Form", description: "Performant, flexible forms", icon: "📝", url: "https://react-hook-form.com", bgColor: "hsl(var(--card))" },
      { name: "Embla Carousel", description: "Lightweight carousel library", icon: "🎠", url: "https://embla-carousel.com", bgColor: "hsl(var(--card))" }
    ]
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar - Sponsors */}
        <aside className="hidden xl:block w-60 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          {leftSponsors.map((sponsors, idx) => (
            <SponsorCard key={`left-${idx}`} sponsors={sponsors} />
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Heart className="h-20 w-20 text-primary fill-primary opacity-20" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-medium">
            Join the Lovable community with{" "}
            <span className="text-primary">{memberCount}+</span> members
          </h1>
          
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The home for Lovable enthusiasts where you can explore and share prompts, browse templates,
            connect with builders, and discover resources all in one place.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a prompt or template..."
                className="pl-11 h-12 bg-muted/50 border-border text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPrompts.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Featured</h2>
              <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {featuredPrompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  to={`/prompt/${prompt.id}`}
                  className="flex-shrink-0 w-48 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2">{prompt.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {prompt.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Languages Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Popular Languages & Frameworks</h2>
            <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {["TypeScript", "React", "Next.js", "Python", "TailwindCSS", "Supabase"].map((lang) => (
              <Link
                key={lang}
                to={`/browse?search=${encodeURIComponent(lang.toLowerCase())}`}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors text-center"
              >
                <p className="text-sm font-medium">{lang}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
        </div>

        {/* Right Sidebar - Sponsors */}
        <aside className="hidden xl:block w-60 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          {rightSponsors.map((sponsors, idx) => (
            <SponsorCard key={`right-${idx}`} sponsors={sponsors} />
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Index;
