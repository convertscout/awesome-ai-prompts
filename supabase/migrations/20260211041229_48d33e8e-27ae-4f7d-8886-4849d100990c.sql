
-- Email captures table for lead generation
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- No direct SELECT allowed (emails are private)
-- Only INSERT through edge function or service role
CREATE POLICY "Allow anonymous inserts for email capture"
ON public.email_captures
FOR INSERT
WITH CHECK (true);
