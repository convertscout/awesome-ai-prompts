-- Create generation_usage table for tracking daily AI generations
CREATE TABLE public.generation_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  tool TEXT NOT NULL,
  language TEXT,
  framework TEXT,
  prompt_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for fast daily count queries
CREATE INDEX idx_generation_usage_user_date ON public.generation_usage(user_id, generated_at);

-- Enable Row Level Security
ALTER TABLE public.generation_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/insert their own generations
CREATE POLICY "Users can view own generations" 
ON public.generation_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" 
ON public.generation_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);