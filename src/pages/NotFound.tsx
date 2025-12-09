import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Home, Search, TrendingUp, FolderOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: '404 - Page Not Found | Lovable Directory',
    description: 'The page you are looking for could not be found. Browse our collection of AI prompts instead.',
    noindex: true, // Don't index 404 pages
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/browse">
              <Search className="mr-2 h-4 w-4" />
              Browse Prompts
            </Link>
          </Button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/trending">
                <TrendingUp className="mr-1 h-3 w-3" />
                Trending
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/categories">
                <FolderOpen className="mr-1 h-3 w-3" />
                Categories
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cursor-prompts">
                Cursor Prompts
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lovable-prompts">
                Lovable Prompts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
