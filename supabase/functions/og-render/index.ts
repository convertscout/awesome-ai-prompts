import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the prompt data
    const { data: prompt, error } = await supabaseClient
      .from('prompts')
      .select('title, description, category, logo_url, content_type')
      .eq('slug', slug)
      .single();

    if (error || !prompt) {
      console.error('Prompt not found:', slug, error);
      return new Response(JSON.stringify({ error: 'Prompt not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = 'https://lovabledirectory.site';
    const pageUrl = `${baseUrl}/prompt/${slug}`;
    
    // Truncate description to 160 characters for meta description
    const metaDescription = prompt.description.length > 160 
      ? prompt.description.substring(0, 157) + '...'
      : prompt.description;
    
    // Truncate title to 60 characters for meta title
    const metaTitle = prompt.title.length > 60 
      ? prompt.title.substring(0, 57) + '...'
      : prompt.title;

    const contentTypeLabel = prompt.content_type || 'Resource';
    const fullTitle = `${metaTitle} | Lovable Directory`;

    // Return meta tags as JSON for the frontend to use
    const metaTags = {
      title: fullTitle,
      description: metaDescription,
      og: {
        title: fullTitle,
        description: metaDescription,
        url: pageUrl,
        type: 'article',
        image: prompt.logo_url || `${baseUrl}/logo.png`,
        site_name: 'Lovable Directory',
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: metaDescription,
        image: prompt.logo_url || `${baseUrl}/logo.png`,
      },
      canonical: pageUrl,
      category: prompt.category,
      content_type: contentTypeLabel,
    };

    return new Response(JSON.stringify(metaTags), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error in og-render:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
