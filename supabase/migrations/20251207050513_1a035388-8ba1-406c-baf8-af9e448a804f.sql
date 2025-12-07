
-- Create tools table for AI coding tools
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  changelog_url TEXT,
  website_url TEXT,
  brand_color TEXT DEFAULT '#6366f1',
  description TEXT,
  updates_count INTEGER DEFAULT 0,
  last_update_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tool_updates table for changelog entries
CREATE TABLE public.tool_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  update_type TEXT DEFAULT 'feature' CHECK (update_type IN ('feature', 'fix', 'improvement', 'breaking', 'announcement')),
  source_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_major BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Tools are viewable by everyone
CREATE POLICY "Tools are viewable by everyone"
ON public.tools FOR SELECT
USING (true);

-- Tool updates are viewable by everyone
CREATE POLICY "Tool updates are viewable by everyone"
ON public.tool_updates FOR SELECT
USING (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_tool_updates_tool_id ON public.tool_updates(tool_id);
CREATE INDEX idx_tool_updates_published_at ON public.tool_updates(published_at DESC);
CREATE INDEX idx_tools_slug ON public.tools(slug);

-- Create trigger for updated_at on tools
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for updated_at on tool_updates
CREATE TRIGGER update_tool_updates_updated_at
BEFORE UPDATE ON public.tool_updates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment tool updates count
CREATE OR REPLACE FUNCTION public.update_tool_updates_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tools
    SET updates_count = updates_count + 1,
        last_update_at = NEW.published_at
    WHERE id = NEW.tool_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tools
    SET updates_count = updates_count - 1
    WHERE id = OLD.tool_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for auto-updating tool updates count
CREATE TRIGGER update_tool_updates_count_trigger
AFTER INSERT OR DELETE ON public.tool_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_tool_updates_count();
