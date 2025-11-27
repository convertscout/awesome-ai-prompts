-- Add logo_url and url columns to prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS url TEXT;

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;

-- Create RLS policies for logos bucket
CREATE POLICY "Logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'logos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'logos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'logos' 
  AND auth.uid() IS NOT NULL
);