import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Sponsor {
  name: string;
  description: string;
  icon: string;
  url: string;
  bgColor: string;
}

interface SponsorStripProps {
  sponsors: Sponsor[];
}

export const SponsorStrip = ({ sponsors }: SponsorStripProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sponsors.length]);

  return (
    <div className="w-full overflow-hidden bg-secondary/50 border-y border-border py-3">
      <div className="flex gap-3 animate-scroll">
        {sponsors.map((sponsor, idx) => (
          <a
            key={idx}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{sponsor.icon}</span>
            <span className="text-sm font-medium text-foreground">{sponsor.name}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        ))}
        {/* Duplicate for seamless loop */}
        {sponsors.map((sponsor, idx) => (
          <a
            key={`dup-${idx}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{sponsor.icon}</span>
            <span className="text-sm font-medium text-foreground">{sponsor.name}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
};
