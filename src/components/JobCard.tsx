import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface JobCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  logoUrl?: string;
}

export const JobCard = ({ slug, title, description, tags, logoUrl }: JobCardProps) => {
  // Extract company and location from tags if available
  const company = tags?.[0] || "Company";
  const location = tags?.[1] || "Remote";
  
  return (
    <div className="flex items-start justify-between py-4 border-b border-border/50 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        {logoUrl ? (
          <img src={logoUrl} alt={company} className="w-10 h-10 rounded object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {company.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <span>{company}</span>
            <span>•</span>
            <span>{location}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild className="ml-4 flex-shrink-0">
        <Link to={`/prompt/${slug}`}>View</Link>
      </Button>
    </div>
  );
};
