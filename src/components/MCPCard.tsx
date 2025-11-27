import { Link } from "react-router-dom";

interface MCPCardProps {
  id: string;
  slug: string;
  title: string;
}

export const MCPCard = ({ slug, title }: MCPCardProps) => {
  return (
    <Link
      to={`/prompt/${slug}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-accent transition-colors"
    >
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};
