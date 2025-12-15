import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  'https://lovabledirectory.site',
  'https://www.lovabledirectory.site',
  'https://lovable.dev',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

const DAILY_LIMIT = 3;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Please sign in to use the AI generator' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user's JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // Check daily usage limit
    const today = new Date().toISOString().split('T')[0];
    const { count, error: countError } = await supabase
      .from('generation_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('generated_at', `${today}T00:00:00Z`);

    if (countError) {
      console.error('Count error:', countError);
      throw new Error('Failed to check usage limit');
    }

    const currentUsage = count || 0;
    if (currentUsage >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached',
          message: `You've used all ${DAILY_LIMIT} free generations today. Come back tomorrow!`,
          remaining: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { tool, language, framework, promptType, description } = await req.json();

    if (!tool || !promptType || !description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: tool, promptType, description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the AI prompt based on output type
    const systemPrompts: Record<string, string> = {
      rules: `You are an expert AI prompt engineer specializing in creating IDE rules files.
Generate a comprehensive ${tool} rules file for a ${language || 'general'} ${framework ? `/ ${framework}` : ''} project.
The output should be ready to copy-paste into a .cursorrules, .windsurfrules, or similar config file.
Include best practices, coding standards, preferred patterns, and specific instructions for the AI assistant.
Format the output as a clean, well-organized rules file without any markdown code blocks - just the raw content.`,
      
      system_prompt: `You are an expert AI prompt engineer specializing in creating system prompts.
Generate a comprehensive system prompt for ${tool} that guides it to be an expert ${language || 'programming'} ${framework ? `${framework} ` : ''}developer.
The prompt should define the AI's personality, expertise, coding style preferences, and response format.
Make it detailed and production-ready. Output only the system prompt content, no explanations.`,
      
      coding_instructions: `You are an expert AI prompt engineer specializing in coding instruction prompts.
Generate detailed coding instructions for ${tool} to help with ${language || 'general'} ${framework ? `/ ${framework}` : ''} development.
Include specific patterns, best practices, error handling approaches, and code organization guidelines.
The instructions should be actionable and immediately usable. Output only the instructions, no explanations.`
    };

    const systemPrompt = systemPrompts[promptType] || systemPrompts.rules;

    console.log(`Generating ${promptType} for ${tool} (${language}/${framework}) - User: ${userId}`);

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Project description: ${description}` }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service is busy. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Record usage
    const { error: insertError } = await supabase
      .from('generation_usage')
      .insert({
        user_id: userId,
        tool,
        language,
        framework,
        prompt_type: promptType,
        tokens_used: aiData.usage?.total_tokens || 0
      });

    if (insertError) {
      console.error('Usage tracking error:', insertError);
      // Don't fail the request if tracking fails
    }

    const remaining = DAILY_LIMIT - currentUsage - 1;

    return new Response(
      JSON.stringify({
        content: generatedContent,
        remaining,
        message: remaining > 0 
          ? `Generated successfully! ${remaining} generation${remaining !== 1 ? 's' : ''} remaining today.`
          : 'Generated successfully! This was your last free generation for today.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate prompt error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Generation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
