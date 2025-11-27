import { Link } from "react-router-dom";

interface NewsCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export const NewsCard = ({ slug, title, description }: NewsCardProps) => {
  return (
    <Link
      to={`/prompt/${slug}`}
      className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
    >
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </Link>
  );
};
