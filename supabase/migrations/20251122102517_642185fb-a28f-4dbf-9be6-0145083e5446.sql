-- Fix security warnings by setting search_path for calculate_trending_score
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