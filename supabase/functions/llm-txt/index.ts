import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/plain',
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

    // Get total count of resources
    const { count } = await supabaseClient
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    const llmTxt = `# Lovable Directory

## About
Lovable Directory is a comprehensive directory for AI-powered development tools and resources. We provide prompts, templates, guides, MCP servers, jobs, and resources for Lovable, Cursor, GitHub Copilot, Base44, Emergent, and other AI coding tools.

## Statistics
- Total Resources: ${count || 0}+
- Active Community Members: 1500+

## Main Sections
- Browse: Explore all prompts, templates, and resources
- Trending: Discover what's popular in the community
- Categories: Find resources by topic (UI/UX, Components, Integrations, Authentication, Performance, etc.)
- Submit: Share your own prompts, templates, and resources with the community
- Jobs: Find opportunities in AI-powered development

## Content Types
- Prompts: AI coding prompts for various tasks
- Templates: Ready-to-use code templates
- Components: UI components and patterns
- Guides: Step-by-step tutorials and best practices
- MCP Servers: Model Context Protocol servers for AI assistants
- Tools: Development tools and utilities
- News: Latest updates in AI coding
- Jobs: Career opportunities in AI development
- Code: Code snippets and examples

## Key Features
- Curated collection of AI coding prompts and resources
- Community-driven resource sharing
- Favorites system for saving useful resources
- Advanced search and filter capabilities
- Support for multiple AI coding platforms
- SEO-optimized resource pages
- Real-time trending content

## Categories
- UI/UX Design
- Components & Templates
- Integrations & APIs
- Best Practices
- Animations
- Forms & Validation
- Layouts
- Data Visualization
- Authentication & Security
- Performance Optimization

## Target Audience
Developers, designers, and builders using AI-powered coding tools like Lovable, Cursor, GitHub Copilot, Base44, Emergent, and other AI assistants.

## Community
Join ${count || 1500}+ developers sharing and discovering AI coding resources. Sign up to save favorites and contribute your own prompts and resources.

## API Access
Access our resources programmatically through our API.

## Contact & Links
- Website: https://lovabledirectory.site
- Browse All: https://lovabledirectory.site/browse
- Submit Resource: https://lovabledirectory.site/submit
- Trending: https://lovabledirectory.site/trending
- Categories: https://lovabledirectory.site/categories

## Contributing
We welcome contributions from the community. Submit your prompts, templates, guides, and resources to help others in the AI development community.`;

    return new Response(llmTxt, {
      headers: corsHeaders,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`# Lovable Directory\n\nError generating content: ${errorMessage}`, {
      headers: corsHeaders,
    });
  }
});