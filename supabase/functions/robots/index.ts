const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/plain',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const robotsTxt = `# Lovable Directory
# https://lovabledirectory.site

User-agent: *
Allow: /

# Disallow private/auth pages
Disallow: /auth
Disallow: /profile
Disallow: /favorites

# AI Crawlers - Welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemap
Sitemap: https://lovabledirectory.site/sitemap.xml

# LLMs.txt for AI systems
# https://lovabledirectory.site/llms.txt
# Full content: https://nkbtvxoojkllafmjjhis.supabase.co/functions/v1/llms-full`;

  return new Response(robotsTxt, {
    headers: corsHeaders,
  });
});