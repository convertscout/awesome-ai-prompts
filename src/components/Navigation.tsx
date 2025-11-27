import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Heart, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="border-b border-border/50 bg-background sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="hidden sm:inline">lovable.directory</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
              Rules
            </Link>
            <Link to="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
              Submit
            </Link>
            <Link to="/browse?type=job" className="text-muted-foreground hover:text-foreground transition-colors">
              Job
            </Link>
            <Link to="/browse?type=code" className="text-muted-foreground hover:text-foreground transition-colors">
              Codes
            </Link>
            {user && (
              <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                Favorites
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                More <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link to="/browse" className="cursor-pointer">Browse All</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trending" className="cursor-pointer">Trending</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories" className="cursor-pointer">Languages</Link>
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs">
              Sign Out
            </Button>
          ) : (
            <Button size="sm" asChild className="text-xs bg-white text-black hover:bg-white/90">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
