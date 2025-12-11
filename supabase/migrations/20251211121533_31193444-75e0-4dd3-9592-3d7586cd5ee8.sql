-- Fix function search_path security warnings for functions that don't already have it set
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.increment_prompt_views(uuid) SET search_path = public;