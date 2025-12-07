import { ExternalLink } from "lucide-react";
import { UpdateCard } from "./UpdateCard";

interface Update {
  id: string;
  title: string;
  description?: string;
  update_type: 'feature' | 'fix' | 'improvement' | 'breaking' | 'announcement';
  source_url?: string;
  published_at: string;
  is_major: boolean;
}

interface ToolColumnProps {
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor: string;
  changelogUrl?: string;
  updates: Update[];
  updatesCount: number;
}

export const ToolColumn = ({
  name,
  slug,
  logoUrl,
  brandColor,
  changelogUrl,
  updates,
  updatesCount,
}: ToolColumnProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Tool header */}
      <div 
        className="sticky top-0 z-10 p-4 rounded-t-lg border-b-2"
        style={{ 
          backgroundColor: `${brandColor}15`,
          borderBottomColor: brandColor 
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="h-8 w-8 rounded-lg" />
            ) : (
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: brandColor }}
              >
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground">{updatesCount} updates</p>
            </div>
          </div>
          
          {changelogUrl && (
            <a 
              href={changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="View full changelog"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Updates list */}
      <div className="flex-1 p-3 space-y-3 bg-card/30 rounded-b-lg border border-t-0 border-border overflow-y-auto max-h-[600px]">
        {updates.length > 0 ? (
          updates.map((update) => (
            <UpdateCard
              key={update.id}
              title={update.title}
              description={update.description}
              updateType={update.update_type}
              sourceUrl={update.source_url}
              publishedAt={update.published_at}
              isMajor={update.is_major}
              toolName={name}
              toolColor={brandColor}
              toolLogo={logoUrl}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No updates yet</p>
            <p className="text-xs mt-1">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};
