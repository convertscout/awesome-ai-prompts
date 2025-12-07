import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed!",
            description: "This email is already on our list.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: "Subscribed!",
          description: "You'll receive our daily AI tools digest.",
        });
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div id="newsletter" className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/30 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/20 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">You're In!</h3>
        <p className="text-muted-foreground">
          Check your inbox for a confirmation. We'll send you daily updates on what's shipping in the AI coding world.
        </p>
      </div>
    );
  }

  return (
    <div id="newsletter" className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/30 rounded-xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Daily AI Tools Digest</h3>
          <p className="text-muted-foreground">
            Get a curated summary of all the updates from Cursor, Lovable, Bolt, and more. 
            Delivered every morning. No spam, unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-[250px] bg-background border-border"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe <Send className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
