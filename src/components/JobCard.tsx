import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface JobCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
}

export const JobCard = ({ slug, title, description, tags }: JobCardProps) => {
  // Extract company and location from tags if available
  const company = tags?.[0] || "Company";
  const location = tags?.[1] || "Remote";
  
  return (
    <div className="flex items-start justify-between py-4 border-b border-border/50 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center text-[10px]">
              {company.charAt(0)}
            </span>
            {company}
          </span>
          <span>•</span>
          <span>{location}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <Button variant="ghost" size="sm" asChild className="ml-4">
        <Link to={`/prompt/${slug}`}>View</Link>
      </Button>
    </div>
  );
};
