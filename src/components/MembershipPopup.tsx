import { useState, useEffect } from "react";
import { X, Star, Zap, Heart, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const MembershipPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = async () => {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return;

      // Check if popup was shown today
      const lastShown = localStorage.getItem("membershipPopupLastShown");
      const today = new Date().toDateString();
      
      if (lastShown === today) return;

      // Show popup after a short delay
      setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem("membershipPopupLastShown", today);
      }, 3000);
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const benefits = [
    { icon: BookMarked, text: "Save your favorite prompts & templates" },
    { icon: Heart, text: "Like and bookmark resources" },
    { icon: Star, text: "Submit your own prompts to the community" },
    { icon: Zap, text: "Get early access to new features" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Star className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Join the Vibe Coding Community
          </h2>
          <p className="text-sm text-muted-foreground">
            Unlock exclusive features and connect with 12,000+ AI builders
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link to="/auth" className="block">
            <Button className="w-full" size="lg">
              Sign Up Free
            </Button>
          </Link>
          <button
            onClick={handleClose}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
