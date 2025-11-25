-- Update the content_type check constraint to include 'mcp'
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_content_type_check;

ALTER TABLE prompts ADD CONSTRAINT prompts_content_type_check 
CHECK (content_type IN ('prompt', 'template', 'component', 'guide', 'resource', 'news', 'tool', 'tutorial', 'mcp'));