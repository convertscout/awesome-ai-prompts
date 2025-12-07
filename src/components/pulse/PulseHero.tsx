import { Activity, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PulseHeroProps {
  totalUpdates: number;
  todayUpdates: number;
}

export const PulseHero = ({ totalUpdates, todayUpdates }: PulseHeroProps) => {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container relative px-4">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive/30 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
            </span>
            <span className="text-sm font-medium text-destructive-foreground">LIVE UPDATES</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Vibe Coding Pulse
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Real-time changelog battleground. See which AI coding tool is shipping the fastest.
            Never miss an update from Cursor, Lovable, Bolt, Windsurf & more.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-card/50 border border-border rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold">{totalUpdates}</p>
                <p className="text-xs text-muted-foreground">Total Updates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-3 bg-card/50 border border-border rounded-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div className="text-left">
                <p className="text-2xl font-bold">{todayUpdates}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-3 bg-card/50 border border-border rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Tools Tracked</p>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="mt-4 bg-primary hover:bg-primary/90"
            onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Daily Digest
          </Button>
        </div>
      </div>
    </section>
  );
};
