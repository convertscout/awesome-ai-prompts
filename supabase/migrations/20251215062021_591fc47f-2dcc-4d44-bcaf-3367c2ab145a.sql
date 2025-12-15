-- Fix: Require authentication for prompt creation (prevent spam)
DROP POLICY IF EXISTS "Anyone can create prompts" ON public.prompts;
CREATE POLICY "Authenticated users can create prompts" 
ON public.prompts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix: Restrict trending_items write access to prevent manipulation
DROP POLICY IF EXISTS "Authenticated users can update trending" ON public.trending_items;
CREATE POLICY "Only admins can modify trending" 
ON public.trending_items 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Keep SELECT policy for trending_items
-- (already exists: "Trending items are viewable by everyone")

-- Add DELETE policy for prompts (only author can delete)
CREATE POLICY "Users can delete their own prompts" 
ON public.prompts 
FOR DELETE 
USING (auth.uid() = author_id);

-- Add DELETE policy for profiles (only owner can delete)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);