import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed
    }

    // Check localStorage for prompt history
    const promptHistory = localStorage.getItem('pwa-install-prompts');
    const history = promptHistory ? JSON.parse(promptHistory) : [];
    
    // Filter prompts from last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentPrompts = history.filter((timestamp: number) => timestamp > oneWeekAgo);
    
    // Show only if less than 2 prompts in the last week
    if (recentPrompts.length >= 2) {
      return;
    }

    // For iOS, show prompt after delay
    if (iOS) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) return;

    // Log this prompt
    const promptHistory = localStorage.getItem('pwa-install-prompts');
    const history = promptHistory ? JSON.parse(promptHistory) : [];
    history.push(Date.now());
    localStorage.setItem('pwa-install-prompts', JSON.stringify(history));

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
    
    setShowPrompt(false);
  };

  const handleClose = () => {
    // Log this prompt even if dismissed
    const promptHistory = localStorage.getItem('pwa-install-prompts');
    const history = promptHistory ? JSON.parse(promptHistory) : [];
    history.push(Date.now());
    localStorage.setItem('pwa-install-prompts', JSON.stringify(history));
    
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3 mb-3">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg" />
        <div>
          <h3 className="font-semibold text-foreground">Install Lovable Directory</h3>
          <p className="text-sm text-muted-foreground">
            {isIOS 
              ? "Add to your home screen for quick access" 
              : "Install our app for a better experience"}
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>To install:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Tap the Share button in Safari</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
          <Button onClick={handleClose} className="w-full mt-3" variant="secondary" size="sm">
            Got it
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 mt-2">
          <Button onClick={handleInstallClick} className="flex-1" size="sm">
            Install
          </Button>
          <Button onClick={handleClose} variant="outline" size="sm">
            Not now
          </Button>
        </div>
      )}
    </div>
  );
};
