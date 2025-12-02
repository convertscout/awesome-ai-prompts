import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SponsorCard } from "@/components/SponsorCard";
import { SponsorStrip } from "@/components/SponsorStrip";
import { MCPCard } from "@/components/MCPCard";
import { JobCard } from "@/components/JobCard";
import { NewsCard } from "@/components/NewsCard";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  views_count: number;
  favorites_count: number;
  content?: string;
  language?: string;
  framework?: string;
  content_type?: string;
  logo_url?: string;
}
const Index = () => {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [memberCount, setMemberCount] = useState(12000);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [mcpItems, setMcpItems] = useState<Prompt[]>([]);
  const [newsItems, setNewsItems] = useState<Prompt[]>([]);
  const [jobItems, setJobItems] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: featured
      } = await supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").eq("is_featured", true).order("created_at", {
        ascending: false
      }).limit(6);
      const {
        data: all
      } = await supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").order("created_at", {
        ascending: false
      }).limit(30);
      const {
        data: mcp
      } = await supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content_type, logo_url").eq("content_type", "mcp").order("created_at", {
        ascending: false
      }).limit(12);
      const {
        data: news
      } = await supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, logo_url").eq("content_type", "news").order("created_at", {
        ascending: false
      }).limit(5);
      const {
        data: jobs
      } = await supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, logo_url").eq("content_type", "job").order("created_at", {
        ascending: false
      }).limit(5);
      if (featured) setFeaturedPrompts(featured);
      if (all) setAllPrompts(all);
      if (mcp) setMcpItems(mcp);
      if (news) setNewsItems(news);
      if (jobs) setJobItems(jobs);
    };
    fetchData();
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
  };
  const leftSponsors = [[{
    name: "Supabase",
    description: "Build in a weekend, scale to millions",
    icon: "⚡",
    url: "https://supabase.com",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Vercel",
    description: "Deploy with zero configuration",
    icon: "▲",
    url: "https://vercel.com",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "TailwindCSS",
    description: "Rapidly build modern websites",
    icon: "🎨",
    url: "https://tailwindcss.com",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Framer Motion",
    description: "Production-ready animations",
    icon: "🎬",
    url: "https://framer.com/motion",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "React Query",
    description: "Powerful data synchronization",
    icon: "🔄",
    url: "https://tanstack.com/query",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Stripe",
    description: "Payment infrastructure",
    icon: "💳",
    url: "https://stripe.com",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "n8n",
    description: "Workflow automation tool",
    icon: "🔗",
    url: "https://n8n.io",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Resend",
    description: "Email for developers",
    icon: "📧",
    url: "https://resend.com",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "Clerk",
    description: "Complete user management",
    icon: "🔐",
    url: "https://clerk.com",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Prisma",
    description: "Next-generation ORM",
    icon: "🗄️",
    url: "https://prisma.io",
    bgColor: "hsl(var(--card))"
  }]];
  const rightSponsors = [[{
    name: "TypeScript",
    description: "JavaScript with syntax for types",
    icon: "📘",
    url: "https://typescriptlang.org",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Vite",
    description: "Next generation frontend tooling",
    icon: "⚡",
    url: "https://vitejs.dev",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "Shadcn/ui",
    description: "Beautifully designed components",
    icon: "🎯",
    url: "https://ui.shadcn.com",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Lucide",
    description: "Beautiful & consistent icons",
    icon: "🎨",
    url: "https://lucide.dev",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "Zod",
    description: "TypeScript-first schema validation",
    icon: "✅",
    url: "https://zod.dev",
    bgColor: "hsl(var(--card))"
  }, {
    name: "React Router",
    description: "Declarative routing for React",
    icon: "🧭",
    url: "https://reactrouter.com",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "Recharts",
    description: "Composable charting library",
    icon: "📊",
    url: "https://recharts.org",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Date-fns",
    description: "Modern JavaScript date utility",
    icon: "📅",
    url: "https://date-fns.org",
    bgColor: "hsl(var(--card))"
  }], [{
    name: "React Hook Form",
    description: "Performant, flexible forms",
    icon: "📝",
    url: "https://react-hook-form.com",
    bgColor: "hsl(var(--card))"
  }, {
    name: "Embla Carousel",
    description: "Lightweight carousel library",
    icon: "🎠",
    url: "https://embla-carousel.com",
    bgColor: "hsl(var(--card))"
  }]];
  const allSponsors = [...leftSponsors.flat(), ...rightSponsors.flat()];
  return <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <PWAInstallPrompt />
      
      {/* Mobile Sponsor Strip - Top */}
      <div className="xl:hidden">
        <SponsorStrip sponsors={allSponsors} />
      </div>

      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar - Sponsors */}
        <aside className="hidden xl:block w-60 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          {leftSponsors.map((sponsors, idx) => <SponsorCard key={`left-${idx}`} sponsors={sponsors} />)}
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <img alt="Lovable Directory Logo" src="/lovable-uploads/81abbcb3-4813-4575-8167-480ea5e6696e.png" className="h-24 w-24 object-fill" />
          </div>
          
          <div className="flex justify-center">
            <a href="https://www.producthunt.com/products/vibe-coding-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-vibe&#0045;coding&#0045;2" target="_blank" rel="noopener noreferrer">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1042692&theme=light&t=1764670248517" alt="Vibe&#0032;Coding - The&#0032;vibe&#0045;coding&#0032;hub&#0058;&#0032;prompts&#0044;&#0032;jobs&#0044;&#0032;ideas&#0032;&#0038;&#0032;indie&#0032;projects | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
            </a>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-medium">
            Join the vibecoding community with{" "}
            <span className="font-semibold text-purple-400">{memberCount}+</span> members
          </h1>
          
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your hub for AI-powered development. Explore prompts and templates for Lovable, Cursor, GitHub Copilot, Base44, Emergent, and more. Share resources, connect with builders, and discover everything you need to build faster with AI coding tools.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for a prompt or template..." className="pl-11 h-12 bg-muted/50 border-border text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </form>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPrompts.length > 0 && <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Featured</h2>
              <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPrompts.map(prompt => <Link key={prompt.id} to={`/prompt/${prompt.slug}`} className="group p-5 rounded-lg border border-border bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                  {prompt.content && <div className="mb-3 bg-muted/30 rounded-md p-3">
                      <p className="text-xs font-mono text-muted-foreground line-clamp-3">
                        {prompt.content}
                      </p>
                    </div>}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary-glow transition-colors">{prompt.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {prompt.description}
                  </p>
                </Link>)}
            </div>
          </div>
        </section>}

      {/* MCP Section */}
      {mcpItems.length > 0 && <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Featured MCPs</h2>
              <Link to="/browse?type=mcp" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {mcpItems.map(mcp => <MCPCard key={mcp.id} id={mcp.id} slug={mcp.slug} title={mcp.title} logoUrl={mcp.logo_url} />)}
            </div>
          </div>
        </section>}

      {/* News Section */}
      {newsItems.length > 0 && <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Trending in Cursor (News)</h2>
              <Link to="/browse?type=news" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsItems.map(news => <NewsCard key={news.id} id={news.id} slug={news.slug} title={news.title} description={news.description} />)}
            </div>
          </div>
        </section>}

      {/* Jobs Section */}
      {jobItems.length > 0 && <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Featured Jobs</h2>
              <Link to="/browse?type=job" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="border border-border rounded-lg divide-y divide-border/50 p-4">
              {jobItems.map(job => <JobCard key={job.id} id={job.id} slug={job.slug} title={job.title} description={job.description} tags={job.tags} logoUrl={job.logo_url} />)}
            </div>
          </div>
        </section>}

      {/* All Prompts Section */}
      {allPrompts.length > 0 && <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Latest Resources</h2>
              <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPrompts.map(prompt => <Link key={prompt.id} to={`/prompt/${prompt.slug}`} className="group p-5 rounded-lg border border-border bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                  {prompt.content && <div className="mb-3 bg-muted/30 rounded-md p-3">
                      <p className="text-xs font-mono text-muted-foreground line-clamp-3">
                        {prompt.content}
                      </p>
                    </div>}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary-glow transition-colors">{prompt.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {prompt.description}
                  </p>
                </Link>)}
            </div>
          </div>
        </section>}

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
            {["TypeScript", "React", "Next.js", "Python", "TailwindCSS", "Supabase"].map(lang => <Link key={lang} to={`/browse?search=${encodeURIComponent(lang.toLowerCase())}`} className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors text-center">
                <p className="text-sm font-medium">{lang}</p>
              </Link>)}
          </div>
        </div>
      </section>
        </div>

        {/* Right Sidebar - Sponsors */}
        <aside className="hidden xl:block w-60 flex-shrink-0 pt-20 px-4 space-y-3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          {rightSponsors.map((sponsors, idx) => <SponsorCard key={`right-${idx}`} sponsors={sponsors} />)}
        </aside>
      </div>

      {/* Mobile Sponsor Strip - Bottom */}
      <div className="xl:hidden">
        <SponsorStrip sponsors={allSponsors} />
      </div>
    </div>;
};
export default Index;