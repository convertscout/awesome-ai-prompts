import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

export const SponsorStrip = () => {
  return (
    <div className="w-full bg-primary/5 border-y border-primary/20 py-3">
      <Link 
        to="/advertise" 
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Megaphone className="h-4 w-4 text-primary" />
        <span>Advertise Here</span>
        <span className="text-primary font-medium">→ Reach 200K+ developers</span>
      </Link>
    </div>
  );
};
