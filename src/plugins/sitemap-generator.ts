import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://lovabledirectory.site';
const SUPABASE_URL = 'https://nkbtvxoojkllafmjjhis.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYnR2eG9vamtsbGFmbWpqaGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDIwNzEsImV4cCI6MjA3OTM3ODA3MX0.DQ2IoidN8MMSulyEbgHSxfnBhbUCgunwe5H08Kalem0';

interface Prompt {
  slug: string;
  updated_at: string;
}

async function fetchPrompts(): Promise<Prompt[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/prompts?select=slug,updated_at&slug=not.is.null`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch prompts:', response.statusText);
      return [];
    }
    
    return (await response.json()) as Prompt[];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}

function generateSitemapXml(prompts: Prompt[]): string {
  const today = '2025-12-16';
  
  const staticPages = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/browse', changefreq: 'daily', priority: '0.9' },
    { loc: '/trending', changefreq: 'daily', priority: '0.9' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/submit', changefreq: 'monthly', priority: '0.7' },
    // SEO Landing Pages - High priority for keyword targeting
    { loc: '/chatgpt-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/gemini-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/claude-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/cursor-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/lovable-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/github-copilot-prompts', changefreq: 'daily', priority: '0.9' },
    { loc: '/ai-code-generator', changefreq: 'daily', priority: '0.9' },
    { loc: '/best-ai-for-coding', changefreq: 'daily', priority: '0.9' },
  ];

  const staticUrls = staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const promptUrls = prompts.map(prompt => {
    const lastmod = prompt.updated_at 
      ? new Date(prompt.updated_at).toISOString().split('T')[0]
      : today;
    return `
  <url>
    <loc>${SITE_URL}/prompt/${prompt.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${promptUrls}
</urlset>`;
}

export function sitemapGenerator(): Plugin {
  return {
    name: 'sitemap-generator',
    async closeBundle() {
      console.log('🗺️  Generating sitemap...');
      
      const prompts = await fetchPrompts();
      const sitemap = generateSitemapXml(prompts);
      
      const outputPath = resolve(process.cwd(), 'dist', 'sitemap.xml');
      writeFileSync(outputPath, sitemap, 'utf-8');
      
      console.log(`✅ Sitemap generated with ${prompts.length + 13} URLs`);
    },
  };
}
