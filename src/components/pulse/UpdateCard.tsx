import { ExternalLink, Zap, Bug, Sparkles, AlertTriangle, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface UpdateCardProps {
  title: string;
  description?: string;
  updateType: string;
  sourceUrl?: string;
  publishedAt: string;
  isMajor: boolean;
  toolName: string;
  toolColor: string;
  toolLogo?: string;
}

type UpdateType = 'feature' | 'fix' | 'improvement' | 'breaking' | 'announcement';

const typeConfig: Record<UpdateType, { icon: typeof Sparkles; label: string; className: string }> = {
  feature: { icon: Sparkles, label: 'Feature', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  fix: { icon: Bug, label: 'Bug Fix', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  improvement: { icon: Zap, label: 'Improvement', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  breaking: { icon: AlertTriangle, label: 'Breaking', className: 'bg-destructive/20 text-destructive border-destructive/30' },
  announcement: { icon: Megaphone, label: 'Announcement', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export const UpdateCard = ({
  title,
  description,
  updateType,
  sourceUrl,
  publishedAt,
  isMajor,
  toolName,
  toolColor,
  toolLogo,
}: UpdateCardProps) => {
  const validType = (updateType as UpdateType) in typeConfig ? (updateType as UpdateType) : 'feature';
  const config = typeConfig[validType];
  const TypeIcon = config.icon;
  
  return (
    <div 
      className={`group relative p-4 bg-card/50 border border-border rounded-lg hover:border-primary/50 transition-all duration-300 ${
        isMajor ? 'ring-2 ring-primary/30 bg-primary/5' : ''
      }`}
    >
      {/* Major update indicator */}
      {isMajor && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
              <Zap className="h-2.5 w-2.5 text-primary-foreground" />
            </span>
          </span>
        </div>
      )}

      {/* Tool indicator */}
      <div className="flex items-center gap-2 mb-3">
        {toolLogo ? (
          <img src={toolLogo} alt={toolName} className="h-5 w-5 rounded" />
        ) : (
          <div 
            className="h-5 w-5 rounded flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: toolColor }}
          >
            {toolName.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium" style={{ color: toolColor }}>
          {toolName}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
        </span>
      </div>

      {/* Update type badge */}
      <Badge variant="outline" className={`mb-2 ${config.className}`}>
        <TypeIcon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>

      {/* Content */}
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
      )}

      {/* Source link */}
      {sourceUrl && (
        <a 
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View changelog <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};
