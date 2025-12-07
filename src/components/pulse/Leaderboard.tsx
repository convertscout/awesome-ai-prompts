import { Trophy, TrendingUp, Zap } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  logo_url?: string;
  brand_color: string;
  updates_count: number;
  last_update_at?: string;
}

interface LeaderboardProps {
  tools: Tool[];
}

export const Leaderboard = ({ tools }: LeaderboardProps) => {
  // Sort tools by updates count
  const sortedTools = [...tools].sort((a, b) => b.updates_count - a.updates_count);
  
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Shipping Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Who's building the most?</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTools.map((tool, index) => (
          <div 
            key={tool.id}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            {/* Rank */}
            <div className={`text-2xl font-bold w-8 ${getMedalColor(index)}`}>
              {index === 0 ? <Trophy className="h-6 w-6" /> : `#${index + 1}`}
            </div>

            {/* Tool info */}
            <div className="flex items-center gap-3 flex-1">
              {tool.logo_url ? (
                <img src={tool.logo_url} alt={tool.name} className="h-8 w-8 rounded-lg" />
              ) : (
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: tool.brand_color }}
                >
                  {tool.name.charAt(0)}
                </div>
              )}
              <span className="font-semibold">{tool.name}</span>
            </div>

            {/* Updates count */}
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-bold">{tool.updates_count}</span>
              <span className="text-xs text-muted-foreground">updates</span>
            </div>
          </div>
        ))}
      </div>

      {sortedTools.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Leaderboard coming soon</p>
        </div>
      )}
    </div>
  );
};
