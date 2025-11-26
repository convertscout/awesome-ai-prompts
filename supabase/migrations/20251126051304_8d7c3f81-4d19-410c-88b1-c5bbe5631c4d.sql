-- Fix security warnings by setting search_path for functions

-- Update generate_slug function with search_path
CREATE OR REPLACE FUNCTION public.generate_slug(input_title text)
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Update set_prompt_slug function with search_path
CREATE OR REPLACE FUNCTION public.set_prompt_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;