import { UpdateCard } from "./UpdateCard";

interface Tool {
  id: string;
  name: string;
  logo_url?: string;
  brand_color: string;
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

interface TimelineFeedProps {
  updates: Update[];
  tools: Tool[];
}

export const TimelineFeed = ({ updates, tools }: TimelineFeedProps) => {
  // Create a map for quick tool lookup
  const toolMap = tools.reduce((acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  }, {} as Record<string, Tool>);

  // Sort updates by published_at descending
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Latest Updates</h2>
        <span className="text-sm text-muted-foreground">
          {updates.length} total updates
        </span>
      </div>

      <div className="grid gap-4">
        {sortedUpdates.map((update) => {
          const tool = toolMap[update.tool_id];
          if (!tool) return null;
          
          return (
            <UpdateCard
              key={update.id}
              title={update.title}
              description={update.description}
              updateType={update.update_type}
              sourceUrl={update.source_url}
              publishedAt={update.published_at}
              isMajor={update.is_major}
              toolName={tool.name}
              toolColor={tool.brand_color}
              toolLogo={tool.logo_url}
            />
          );
        })}
      </div>

      {sortedUpdates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No updates yet</p>
          <p className="text-sm mt-1">We're tracking AI coding tools. Updates coming soon!</p>
        </div>
      )}
    </div>
  );
};
