import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

export const SponsorCard = () => {
  return (
    <Link
      to="/advertise"
      className="block p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Megaphone className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground mb-1">
            Advertise Here
          </h3>
          <p className="text-xs text-muted-foreground">
            Reach 200K+ developers monthly
          </p>
        </div>
      </div>
    </Link>
  );
};
