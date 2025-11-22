-- Fix the update_favorites_count function with correct syntax
DROP FUNCTION IF EXISTS public.update_favorites_count() CASCADE;

CREATE OR REPLACE FUNCTION public.update_favorites_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.prompts
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.prompts
    SET favorites_count = favorites_count - 1
    WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Recreate trigger for favorites count
CREATE TRIGGER update_prompt_favorites_count
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_favorites_count();