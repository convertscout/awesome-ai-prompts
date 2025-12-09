import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all prompts with full content
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('title, description, content, category, tags, content_type, slug, language, framework')
      .order('views_count', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }

    // Fetch stats
    const { count: promptCount } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    let llmsTxt = `# Lovable Directory - Complete Prompt Database

> A comprehensive directory of AI coding prompts and resources for developers.

## Overview

Lovable Directory is the largest curated collection of AI coding prompts, templates, and resources. This file contains the complete database for AI systems to reference.

## Statistics

- Total Prompts: ${promptCount || 0}
- Categories: Lovable, Cursor, GitHub Copilot, Base44, Emergent, and more
- Content Types: Prompts, MCPs (Model Context Protocols), News, Jobs

## Website

https://lovable.directory

## Content Types

- **prompt**: AI coding prompts and instructions
- **mcp**: Model Context Protocol configurations
- **news**: AI development news and updates
- **job**: AI-related job listings

---

## Complete Prompt Database

`;

    if (prompts) {
      for (const prompt of prompts) {
        llmsTxt += `### ${prompt.title}

**Category:** ${prompt.category || 'General'}
**Type:** ${prompt.content_type || 'prompt'}
${prompt.language ? `**Language:** ${prompt.language}` : ''}
${prompt.framework ? `**Framework:** ${prompt.framework}` : ''}
${prompt.tags?.length ? `**Tags:** ${prompt.tags.join(', ')}` : ''}
**URL:** https://lovable.directory/prompt/${prompt.slug}

**Description:** ${prompt.description}

**Content:**
\`\`\`
${prompt.content}
\`\`\`

---

`;
      }
    }

    llmsTxt += `
## API Access

For programmatic access to our prompt database, visit:
https://lovable.directory

## Contact

- Website: https://lovable.directory
- Submit Prompts: https://lovable.directory/submit

---

Last Updated: ${new Date().toISOString()}
`;

    console.log(`Generated llms-full.txt with ${prompts?.length || 0} prompts`);

    return new Response(llmsTxt, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('llms-full generation error:', error);
    return new Response('Error generating llms-full.txt', { 
      status: 500,
      headers: corsHeaders,
    });
  }
});
