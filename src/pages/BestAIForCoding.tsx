import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Brain, Code, Sparkles } from "lucide-react";
import { useEffect } from "react";

const BestAIForCoding = () => {
  useSEO({
    title: 'Best AI for Coding 2025 - ChatGPT vs Cursor vs Claude vs Copilot Comparison',
    description: 'Compare the best AI coding tools in 2025. ChatGPT vs Cursor vs Claude vs GitHub Copilot vs Gemini. Find the perfect AI assistant for your programming needs.',
    canonical: 'https://lovabledirectory.site/best-ai-for-coding',
    keywords: ['best AI for coding 2025', 'AI coding tools comparison', 'ChatGPT vs Cursor', 'Claude vs Copilot', 'AI programming assistant'],
    breadcrumbs: [
      { name: 'Home', url: 'https://lovabledirectory.site/' },
      { name: 'Best AI for Coding', url: 'https://lovabledirectory.site/best-ai-for-coding' }
    ]
  });

  // FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best AI for coding in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best AI for coding in 2025 depends on your needs. ChatGPT (GPT-4) is best for general coding and explanations. Cursor AI is best for IDE-integrated development. Claude 3 Opus is best for complex reasoning. GitHub Copilot is best for code completion. Google Gemini is best for multimodal coding with images."
          }
        },
        {
          "@type": "Question",
          "name": "Is ChatGPT or Cursor better for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cursor is better for coding if you want IDE integration - it's built on VS Code with AI deeply integrated. ChatGPT is better for explanations, learning, and when you need to discuss code outside an IDE. Many developers use both together."
          }
        },
        {
          "@type": "Question",
          "name": "Which AI writes the best code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Claude 3 Opus and GPT-4 consistently write the highest quality code for complex tasks. For everyday coding, GitHub Copilot and Cursor provide the best experience due to IDE integration. The quality depends heavily on how well you prompt the AI."
          }
        },
        {
          "@type": "Question",
          "name": "Is AI coding free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Many AI coding tools have free tiers. ChatGPT has a free version with GPT-3.5. Google Gemini is free in Google AI Studio. Claude has a free tier. GitHub Copilot offers free trials and is free for students. Cursor has a free tier with limited requests."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-bestai-faq', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const aiTools = [
    {
      name: 'ChatGPT (GPT-4)',
      icon: Brain,
      rating: '9.5/10',
      bestFor: 'General coding, explanations, learning',
      pricing: 'Free tier + $20/mo Pro',
      pros: ['Best reasoning', 'Great explanations', 'Huge knowledge base', 'Plugin ecosystem'],
      cons: ['No IDE integration', 'Can be slow', 'Context limits'],
      link: '/chatgpt-prompts'
    },
    {
      name: 'Cursor AI',
      icon: Code,
      rating: '9.3/10',
      bestFor: 'IDE-integrated development',
      pricing: 'Free tier + $20/mo Pro',
      pros: ['VS Code based', 'Codebase aware', 'Multi-file editing', 'Fast'],
      cons: ['Learning curve', 'New product', 'Limited free tier'],
      link: '/cursor-prompts'
    },
    {
      name: 'Claude 3',
      icon: Sparkles,
      rating: '9.2/10',
      bestFor: 'Complex reasoning, code review',
      pricing: 'Free tier + $20/mo Pro',
      pros: ['Best reasoning', 'Long context', 'Nuanced understanding', 'Safety focused'],
      cons: ['No IDE integration', 'Can be verbose', 'Slower than GPT-4'],
      link: '/claude-prompts'
    },
    {
      name: 'GitHub Copilot',
      icon: Zap,
      rating: '9.0/10',
      bestFor: 'Code completion, pair programming',
      pricing: '$10/mo (free for students)',
      pros: ['Best autocomplete', 'IDE native', 'GitHub integration', 'Fast'],
      cons: ['Subscription only', 'Less reasoning', 'Privacy concerns'],
      link: '/github-copilot-prompts'
    },
    {
      name: 'Google Gemini',
      icon: Star,
      rating: '8.8/10',
      bestFor: 'Multimodal coding, Android development',
      pricing: 'Free tier available',
      pros: ['Image understanding', 'Large context', 'Free tier', 'Android Studio integration'],
      cons: ['Newer product', 'Less proven', 'Limited integrations'],
      link: '/gemini-prompts'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">AI Coding Tools Comparison</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best AI for Coding 2025
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Compare ChatGPT, Cursor, Claude, GitHub Copilot & Gemini. 
            Find the perfect AI coding assistant for your programming needs.
          </p>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">AI Coding Tools Compared</h2>
          
          <div className="space-y-6">
            {aiTools.map((tool) => (
              <div key={tool.name} className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Left - Name & Rating */}
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-3 mb-2">
                      <tool.icon className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-semibold">{tool.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{tool.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.pricing}</p>
                  </div>

                  {/* Middle - Best For & Features */}
                  <div className="md:w-1/2">
                    <p className="text-sm mb-3"><span className="font-semibold">Best for:</span> {tool.bestFor}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-green-500 mb-2">Pros</p>
                        <ul className="space-y-1">
                          {tool.pros.map((pro) => (
                            <li key={pro} className="text-sm flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-500 mb-2">Cons</p>
                        <ul className="space-y-1">
                          {tool.cons.map((con) => (
                            <li key={con} className="text-sm text-muted-foreground">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right - CTA */}
                  <div className="md:w-1/4 flex md:justify-end">
                    <Link 
                      to={tool.link}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      View Prompts →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Recommendation */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Recommendation</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🎯 For Beginners</h3>
              <p className="text-muted-foreground text-sm">Start with <strong>ChatGPT</strong> - great explanations and easy to use</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">⚡ For Speed</h3>
              <p className="text-muted-foreground text-sm">Use <strong>GitHub Copilot</strong> - fastest autocomplete in your IDE</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🧠 For Complex Tasks</h3>
              <p className="text-muted-foreground text-sm">Choose <strong>Claude 3 Opus</strong> - best for architecture & review</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🛠️ For Full Projects</h3>
              <p className="text-muted-foreground text-sm">Use <strong>Cursor AI</strong> - understands your entire codebase</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What is the best AI for coding in 2025?</h3>
              <p className="text-muted-foreground">It depends on your needs. ChatGPT for general coding, Cursor for IDE integration, Claude for complex reasoning, Copilot for completion, Gemini for multimodal.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Is ChatGPT or Cursor better for coding?</h3>
              <p className="text-muted-foreground">Cursor is better for IDE-integrated development. ChatGPT is better for explanations and learning. Many developers use both.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Is AI coding free?</h3>
              <p className="text-muted-foreground">Many tools have free tiers: ChatGPT (GPT-3.5), Google Gemini, Claude, and Cursor all offer free usage. GitHub Copilot is free for students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started with AI Coding</h2>
          <p className="text-muted-foreground mb-6">Browse our collection of optimized prompts for every AI coding tool</p>
          <Link 
            to="/browse"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Browse All Prompts →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BestAIForCoding;
