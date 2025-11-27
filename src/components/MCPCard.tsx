import { Link } from "react-router-dom";

interface MCPCardProps {
  id: string;
  slug: string;
  title: string;
  logoUrl?: string;
}

export const MCPCard = ({ slug, title, logoUrl }: MCPCardProps) => {
  return (
    <Link
      to={`/prompt/${slug}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-accent transition-colors"
    >
      {logoUrl ? (
        <img src={logoUrl} alt={title} className="w-5 h-5 rounded object-cover" />
      ) : (
        <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-semibold">
          {title.charAt(0)}
        </span>
      )}
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};
