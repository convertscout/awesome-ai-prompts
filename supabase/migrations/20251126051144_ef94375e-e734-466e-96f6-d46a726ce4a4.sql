-- Add slug column to prompts table for SEO-friendly URLs
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Add job to content_type check constraint
ALTER TABLE public.prompts DROP CONSTRAINT IF EXISTS prompts_content_type_check;
ALTER TABLE public.prompts ADD CONSTRAINT prompts_content_type_check 
  CHECK (content_type IN ('prompt', 'template', 'component', 'guide', 'resource', 'news', 'tool', 'tutorial', 'mcp', 'code', 'job'));

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(input_title text)
RETURNS text AS $$
DECLARE
  result_slug text;
  counter integer := 0;
  base_slug text;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(trim(input_title), '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Limit to 60 characters
  base_slug := substring(base_slug from 1 for 60);
  result_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.prompts WHERE slug = result_slug) LOOP
    counter := counter + 1;
    result_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN result_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate slug before insert
CREATE OR REPLACE FUNCTION public.set_prompt_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
DROP TRIGGER IF EXISTS set_prompt_slug_trigger ON public.prompts;
CREATE TRIGGER set_prompt_slug_trigger
  BEFORE INSERT ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_prompt_slug();

-- Generate slugs for existing records
UPDATE public.prompts 
SET slug = generate_slug(title) 
WHERE slug IS NULL;