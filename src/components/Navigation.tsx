import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookMarked, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const Navigation = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              lovable.directory
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/browse">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/favorites">
                  <BookMarked className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/auth">Join Community</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
