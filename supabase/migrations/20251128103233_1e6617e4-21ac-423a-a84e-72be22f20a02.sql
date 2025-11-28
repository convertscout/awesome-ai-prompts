-- Add button_text field to prompts table for custom CTA button labels
ALTER TABLE prompts 
ADD COLUMN button_text text;