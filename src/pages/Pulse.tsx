import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PulseHero } from "@/components/pulse/PulseHero";
import { TimelineFeed } from "@/components/pulse/TimelineFeed";
import { Leaderboard } from "@/components/pulse/Leaderboard";
import { NewsletterSignup } from "@/components/pulse/NewsletterSignup";
import { ToolFilter } from "@/components/pulse/ToolFilter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  brand_color: string;
  changelog_url?: string;
  website_url?: string;
  updates_count: number;
  last_update_at?: string;
}

interface Update {
  id: string;
  tool_id: string;
  title: string;
  description?: string;
  update_type: string;
  source_url?: string;
  published_at: string;
  is_major: boolean;
}

const Pulse = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SEO
  useSEO({
    title: "Vibe Coding Pulse - Real-Time AI Coding Tools Changelog",
    description: "Track real-time updates from Cursor, Lovable, Bolt, Windsurf, and more AI coding tools. See who's shipping fastest in the AI development space.",
    keywords: ["AI coding tools", "Cursor changelog", "Lovable updates", "Bolt.new", "Windsurf", "vibe coding", "AI development"],
    canonical: "https://lovabledirectory.site/pulse",
    ogType: "website",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from('tools')
          .select('*')
          .order('updates_count', { ascending: false });

        if (toolsError) throw toolsError;
        
        const fetchedTools = toolsData || [];
        setTools(fetchedTools);
        setSelectedTools(fetchedTools.map(t => t.id));

        // Fetch updates
        const { data: updatesData, error: updatesError } = await supabase
          .from('tool_updates')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(100);

        if (updatesError) throw updatesError;
        setUpdates(updatesData || []);
      } catch (error) {
        console.error('Error fetching pulse data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToolToggle = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTools(tools.map(t => t.id));
  };

  const handleClearAll = () => {
    setSelectedTools([]);
  };

  // Filter updates based on selected tools
  const filteredUpdates = updates.filter(u => selectedTools.includes(u.tool_id));

  // Calculate today's updates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayUpdates = updates.filter(u => new Date(u.published_at) >= today).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <PulseHero totalUpdates={updates.length} todayUpdates={todayUpdates} />

      {/* Main content */}
      <main className="container px-4 py-8">
        {/* Tool Filter */}
        {tools.length > 0 && (
          <div className="mb-8">
            <ToolFilter
              tools={tools}
              selectedTools={selectedTools}
              onToggle={handleToolToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <TimelineFeed updates={filteredUpdates} tools={tools} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Leaderboard tools={tools} />
            <NewsletterSignup />
          </div>
        </div>
      </main>

      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Vibe Coding Pulse - AI Coding Tools Changelog",
          "description": "Real-time changelog aggregator for AI coding tools including Cursor, Lovable, Bolt, and more.",
          "url": "https://lovabledirectory.site/pulse",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Lovable Directory",
            "url": "https://lovabledirectory.site"
          }
        })
      }} />
    </div>
  );
};

export default Pulse;
