-- Add new content types and expand categories
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'prompt' CHECK (content_type IN ('prompt', 'template', 'component', 'guide', 'resource'));
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS framework TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false;

-- Update category enum to be more flexible
-- First, we need to handle the existing enum
ALTER TABLE prompts ALTER COLUMN category DROP NOT NULL;

-- Add new columns for better categorization
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS primary_tag TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));

-- Create a trending_items table for tracking what's trending
CREATE TABLE IF NOT EXISTS trending_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  trending_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on trending_items
ALTER TABLE trending_items ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing trending items
CREATE POLICY "Trending items are viewable by everyone"
ON trending_items FOR SELECT
USING (true);

-- Create policy for authenticated users to update trending
CREATE POLICY "Authenticated users can update trending"
ON trending_items FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Update RLS policies to allow anyone to view prompts (not just authenticated)
DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON prompts;
CREATE POLICY "Prompts are viewable by everyone"
ON prompts FOR SELECT
USING (true);

-- Allow anyone to submit prompts (we'll moderate later)
DROP POLICY IF EXISTS "Authenticated users can create prompts" ON prompts;
CREATE POLICY "Anyone can create prompts"
ON prompts FOR INSERT
WITH CHECK (true);

-- Function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM trending_items;
  
  INSERT INTO trending_items (prompt_id, trending_score)
  SELECT 
    id,
    (views_count * 0.5 + favorites_count * 2 + 
     EXTRACT(EPOCH FROM (now() - created_at)) / 86400 * -0.1)::INTEGER as score
  FROM prompts
  WHERE created_at > now() - INTERVAL '30 days'
  ORDER BY score DESC
  LIMIT 50;
END;
$$;

-- Add trigger for updated_at on trending_items
CREATE TRIGGER update_trending_items_updated_at
BEFORE UPDATE ON trending_items
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();