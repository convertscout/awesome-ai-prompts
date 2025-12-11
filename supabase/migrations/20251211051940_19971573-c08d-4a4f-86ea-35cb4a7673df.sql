-- Remove the insecure public INSERT policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create a more restrictive policy that only allows service role to insert
CREATE POLICY "Only service role can insert subscribers"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (false);

-- Add unique constraint on email to prevent duplicates (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'newsletter_subscribers_email_key'
  ) THEN
    ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);
  END IF;
END $$;