-- Change category column from enum to text to allow custom categories
ALTER TABLE prompts 
ALTER COLUMN category TYPE text USING category::text;

-- Drop the enum type as it's no longer needed
DROP TYPE IF EXISTS prompt_category CASCADE;