import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all prompts with slugs
    const { data: prompts, error } = await supabaseClient
      .from('prompts')
      .select('slug, updated_at, content_type')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const baseUrl = 'https://lovabledirectory.site';
    const currentDate = new Date().toISOString().split('T')[0];

    // High-priority SEO landing pages targeting high-volume keywords
    const seoLandingPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/generate', priority: '1.0', changefreq: 'daily' }, // AI prompt generator - high intent
      { path: '/browse', priority: '0.9', changefreq: 'daily' },
      { path: '/trending', priority: '0.9', changefreq: 'daily' },
      // Tool-specific pages targeting "[tool] prompts" keywords
      { path: '/chatgpt-prompts', priority: '0.9', changefreq: 'daily' },
      { path: '/cursor-prompts', priority: '0.9', changefreq: 'daily' },
      { path: '/claude-prompts', priority: '0.9', changefreq: 'daily' },
      { path: '/gemini-prompts', priority: '0.9', changefreq: 'daily' },
      { path: '/lovable-prompts', priority: '0.9', changefreq: 'daily' },
      { path: '/github-copilot-prompts', priority: '0.9', changefreq: 'daily' },
      // Informational/comparison pages
      { path: '/ai-code-generator', priority: '0.9', changefreq: 'weekly' },
      { path: '/best-ai-for-coding', priority: '0.9', changefreq: 'weekly' },
      { path: '/categories', priority: '0.8', changefreq: 'weekly' },
      { path: '/submit', priority: '0.6', changefreq: 'monthly' },
    ];

    // Language/framework categories for long-tail keywords
    const categories = [
      'typescript', 'javascript', 'python', 'react', 'nextjs', 'vue',
      'tailwindcss', 'supabase', 'react-native', 'expo', 'nodejs',
      'django', 'fastapi', 'rust', 'go', 'java', 'csharp', 'php',
      'ruby', 'swift', 'kotlin', 'flutter', 'angular', 'svelte'
    ];

    // Content types for filtered browsing
    const contentTypes = ['mcp', 'job', 'code', 'news'];

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add high-priority SEO landing pages
    seoLandingPages.forEach(({ path, priority, changefreq }) => {
      sitemap += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    // Add category search pages (long-tail keywords like "typescript cursor prompts")
    categories.forEach((category) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/browse?search=${encodeURIComponent(category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add content type filtered pages
    contentTypes.forEach((type) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/browse?type=${type}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add all individual prompt/content pages
    prompts?.forEach((prompt) => {
      const lastmod = new Date(prompt.updated_at).toISOString().split('T')[0];
      // Higher priority for prompts, slightly lower for other content types
      const priority = prompt.content_type === 'prompt' ? '0.8' : '0.7';
      sitemap += `
  <url>
    <loc>${baseUrl}/prompt/${prompt.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';

    return new Response(sitemap, {
      headers: corsHeaders,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sitemap generation error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
