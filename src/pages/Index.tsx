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
import { MembershipPopup } from "@/components/MembershipPopup";
import { SpotlightPrompt } from "@/components/SpotlightPrompt";
import { QuickCopyPills } from "@/components/QuickCopyPills";
import { StatsBar } from "@/components/StatsBar";
import { useSEO } from "@/hooks/useSEO";
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

  // SEO for homepage - targeting high-volume keywords
  useSEO({
    title: 'AI Coding Prompts Directory - ChatGPT, Cursor, Claude, Gemini Prompts 2025',
    description: 'Free AI coding prompts for developers. 160+ copy-paste ready prompts for ChatGPT, Cursor AI, Claude, GitHub Copilot, Gemini & more. Boost your coding productivity.',
    canonical: 'https://lovabledirectory.site/',
    ogType: 'website',
  });

  // Add FAQ Schema for homepage rich snippets - optimized for high-volume queries
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best AI prompts for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI coding prompts include structured prompts for ChatGPT, Cursor AI, Claude, and GitHub Copilot. Our directory features 160+ copy-paste ready prompts optimized for code generation, debugging, and refactoring."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use ChatGPT for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use ChatGPT for coding by providing clear, specific prompts. Our ChatGPT coding prompts help you generate code, debug errors, write tests, and refactor existing code. Simply copy a prompt and paste it into ChatGPT."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best AI for coding in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI coding tools in 2025 include ChatGPT, Cursor AI, Claude, GitHub Copilot, and Google Gemini. Each excels in different areas - ChatGPT for general coding, Cursor for IDE integration, Claude for complex reasoning, and Copilot for code completion."
          }
        },
        {
          "@type": "Question",
          "name": "Are these AI coding prompts free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All prompts in our AI coding prompts directory are completely free. Copy-paste ready prompts for ChatGPT, Cursor, Claude, Copilot, Gemini and 10+ AI tools."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-homepage-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all data in parallel for faster loading
      const [featuredRes, allRes, mcpRes, newsRes, jobsRes] = await Promise.all([
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").order("favorites_count", { ascending: false }).order("views_count", { ascending: false }).limit(6),
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content, language, framework, content_type").order("created_at", { ascending: false }).limit(12),
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, content_type, logo_url").eq("content_type", "mcp").order("created_at", { ascending: false }).limit(12),
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, logo_url").eq("content_type", "news").order("created_at", { ascending: false }).limit(5),
        supabase.from("prompts").select("id, slug, title, description, category, tags, views_count, favorites_count, logo_url").eq("content_type", "job").order("created_at", { ascending: false }).limit(5)
      ]);
      
      if (featuredRes.data) setFeaturedPrompts(featuredRes.data);
      if (allRes.data) setAllPrompts(allRes.data);
      if (mcpRes.data) setMcpItems(mcpRes.data);
      if (newsRes.data) setNewsItems(newsRes.data);
      if (jobsRes.data) setJobItems(jobsRes.data);
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
      <MembershipPopup />
      
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
          {/* Compact Hero Section */}
          <section className="relative pt-12 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    alt="Lovable Directory Logo" 
                    src="/lovable-uploads/81abbcb3-4813-4575-8167-480ea5e6696e.png" 
                    className="h-12 w-12 object-fill" 
                  />
                  <div>
                    <h1 className="text-xl md:text-2xl font-semibold">
                      AI Coding Prompts for Developers
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Copy-paste ready prompts for ChatGPT, Cursor, Claude, Copilot, Gemini & 10+ AI tools
                    </p>
                  </div>
                </div>
                <a 
                  href="https://www.producthunt.com/products/vibe-coding-2?embed=true&utm_source=badge-featured&utm_medium=badge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:block"
                >
                  <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1042692&theme=dark&t=1764670248517" 
                    alt="Vibe Coding on Product Hunt" 
                    style={{ width: '180px', height: '40px' }} 
                    width="180" 
                    height="40" 
                  />
                </a>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search prompts, MCPs, tools..." 
                    className="pl-11 h-11 bg-muted/50 border-border text-sm" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </div>
              </form>

              {/* Stats Bar */}
              <StatsBar 
                promptCount={allPrompts.length + featuredPrompts.length} 
                mcpCount={mcpItems.length} 
                jobCount={jobItems.length} 
                memberCount={memberCount} 
              />

              {/* Spotlight Prompt */}
              {featuredPrompts.length > 0 && featuredPrompts[0].content && (
                <div className="mt-6">
                  <SpotlightPrompt
                    id={featuredPrompts[0].id}
                    slug={featuredPrompts[0].slug}
                    title={featuredPrompts[0].title}
                    description={featuredPrompts[0].description}
                    content={featuredPrompts[0].content}
                    viewsCount={featuredPrompts[0].views_count}
                    favoritesCount={featuredPrompts[0].favorites_count}
                  />
                </div>
              )}

              {/* Quick Copy Pills */}
              {allPrompts.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-3">Quick copy:</p>
                  <QuickCopyPills prompts={allPrompts} />
                </div>
              )}
            </div>
          </section>

      {/* Latest Resources Section */}
      {allPrompts.length > 0 && <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Latest Resources</h2>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{allPrompts.length} items</span>
              </div>
              <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPrompts.slice(0, 6).map(prompt => <Link key={prompt.id} to={`/prompt/${prompt.slug}`} className="group p-5 rounded-lg border border-border bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
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