import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export const useSEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  noindex = false,
  breadcrumbs,
}: SEOProps) => {
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

    // Set robots meta tag
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

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

    // Add BreadcrumbList schema if breadcrumbs provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      // Remove existing breadcrumb schema
      const existingBreadcrumb = document.querySelector('script[data-schema="breadcrumb"]');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'breadcrumb');
      script.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    }

    // Cleanup function to reset to defaults
    return () => {
      document.title = 'Lovable Directory - Discover AI Prompts, Jobs & Resources';
      // Remove breadcrumb schema on unmount
      const breadcrumbScript = document.querySelector('script[data-schema="breadcrumb"]');
      if (breadcrumbScript) {
        breadcrumbScript.remove();
      }
    };
  }, [title, description, canonical, ogImage, ogType, noindex, breadcrumbs]);
};
