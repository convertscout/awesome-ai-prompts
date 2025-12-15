import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { Mail, Users, Eye, Globe, Code, Target, CheckCircle, ExternalLink } from "lucide-react";

const Advertise = () => {
  useSEO({
    title: 'Advertise with Lovable Directory | Reach 200K+ Developers Monthly',
    description: 'Promote your developer tool to 19,000+ subscribers and 200,000+ monthly views. US-based audience of developers using AI coding tools. $2,000/month sponsorship.',
    canonical: 'https://lovabledirectory.site/advertise',
    ogType: 'website',
  });

  const stats = [
    { icon: Mail, value: "19,000+", label: "Newsletter Subscribers" },
    { icon: Eye, value: "200,000+", label: "Monthly Views" },
    { icon: Globe, value: "US-Based", label: "Primary Audience" },
    { icon: Target, value: "High-Intent", label: "Developer Audience" },
  ];

  const included = [
    "Homepage sidebar placement (desktop)",
    "Mobile sponsor strip visibility",
    "Your custom branding & messaging",
    "Direct link to your website",
    "Newsletter mention (coming soon)",
    "Dedicated sponsor card with your logo",
  ];

  const audienceDetails = [
    { category: "Languages", items: "TypeScript, Python, JavaScript, Go, Rust" },
    { category: "Tools", items: "ChatGPT, Cursor AI, Claude, GitHub Copilot, Gemini" },
    { category: "Interests", items: "AI-assisted development, DevTools, SaaS" },
    { category: "Geography", items: "US (primary), Canada, Europe, Asia" },
  ];

  const faqs = [
    {
      question: "What ad formats do you support?",
      answer: "We display sponsor cards on homepage sidebars (desktop) and a sponsor strip on mobile. Each includes your logo, name, description, and link."
    },
    {
      question: "How long until my ad goes live?",
      answer: "Once payment is confirmed, your sponsorship goes live within 24-48 hours. We'll reach out for your branding assets."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, sponsorships are month-to-month with no long-term commitment required."
    },
    {
      question: "Do you offer discounts for longer commitments?",
      answer: "Yes! Contact us for quarterly or annual sponsorship packages with special pricing."
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            📢 Sponsor Opportunity
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Advertise with Lovable Directory
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Reach developers actively building with AI tools. Get your product in front of high-intent developers who are searching for the best coding solutions.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
            <a href="https://www.paypal.com/ncp/payment/UHEJ4856M5JPC" target="_blank" rel="noopener noreferrer">
              Become a Sponsor - $2,000/mo
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Why Advertise With Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-card border border-border">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {included.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Our Audience</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {audienceDetails.map((detail, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{detail.category}</h3>
                </div>
                <p className="text-muted-foreground">{detail.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Simple Pricing</h2>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="text-5xl font-bold text-foreground mb-2">$2,000</div>
            <div className="text-lg text-muted-foreground mb-6">per month</div>
            <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Homepage placement on all devices
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                200,000+ impressions/month
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No long-term commitment
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </li>
            </ul>
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="https://www.paypal.com/ncp/payment/UHEJ4856M5JPC" target="_blank" rel="noopener noreferrer">
                Become a Sponsor
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Reach out to us for custom sponsorship packages or any questions about advertising.
          </p>
          <Button asChild variant="outline" size="lg">
            <a href="mailto:hello@lovabledirectory.site">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Advertise;
