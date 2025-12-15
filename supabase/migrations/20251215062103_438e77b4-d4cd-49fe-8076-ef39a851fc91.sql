-- Fix: Block all write operations on tools table (admin only via service role)
CREATE POLICY "No public write access to tools" 
ON public.tools 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Fix: Block all write operations on tool_updates table (admin only via service role)
CREATE POLICY "No public write access to tool_updates" 
ON public.tool_updates 
FOR ALL 
USING (false)
WITH CHECK (false);