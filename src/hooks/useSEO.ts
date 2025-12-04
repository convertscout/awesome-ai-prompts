import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export const useSEO = ({ title, description, canonical, ogImage, ogType = 'website' }: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Set basic meta tags
    setMetaTag('title', title);
    setMetaTag('description', description);

    // Set Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'Lovable Directory', true);
    
    if (canonical) {
      setMetaTag('og:url', canonical, true);
      
      // Update canonical link
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('twitter:image', ogImage);
    }

    // Set Twitter tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);

    // Cleanup function to reset to defaults
    return () => {
      document.title = 'Lovable Directory - Discover AI Prompts, Jobs & Resources';
    };
  }, [title, description, canonical, ogImage, ogType]);
};
