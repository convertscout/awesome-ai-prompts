import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Sponsor {
  name: string;
  description: string;
  icon: string;
  url: string;
  bgColor: string;
}

interface SponsorCardProps {
  sponsors: Sponsor[];
}

export const SponsorCard = ({ sponsors }: SponsorCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sponsors.length);
        setIsFlipping(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [sponsors.length]);

  const currentSponsor = sponsors[currentIndex];

  return (
    <a
      href={currentSponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-lg border border-border transition-all duration-300 hover:border-primary/50 ${
        isFlipping ? "scale-95 opacity-50" : "scale-100 opacity-100"
      }`}
      style={{ backgroundColor: currentSponsor.bgColor }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{currentSponsor.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-foreground truncate">
              {currentSponsor.name}
            </h3>
            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {currentSponsor.description}
          </p>
        </div>
      </div>
    </a>
  );
};
