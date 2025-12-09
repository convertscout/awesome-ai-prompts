-- Add restrictive SELECT policy to protect newsletter subscriber emails
-- Only service_role (backend/edge functions) can read emails, not anonymous or authenticated users

CREATE POLICY "Only service role can read subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (false);

-- Note: Service role bypasses RLS, so edge functions can still access data
-- But client-side queries cannot read subscriber emails