-- Create enum for prompt categories
CREATE TYPE public.prompt_category AS ENUM (
  'ui_ux',
  'components',
  'integrations',
  'best_practices',
  'animations',
  'forms',
  'layouts',
  'data_visualization',
  'authentication',
  'performance'
);

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category prompt_category NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create favorites table for member feature
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompts (readable by everyone)
CREATE POLICY "Prompts are viewable by everyone"
  ON public.prompts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create prompts"
  ON public.prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts"
  ON public.prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment views
CREATE OR REPLACE FUNCTION public.increment_prompt_views(prompt_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.prompts
  SET views_count = views_count + 1
  WHERE id = prompt_id;
END;
$$;

-- Function to update favorites count
CREATE OR REPLACE FUNCTION public.update_favorites_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.prompts
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.prompts
    SET favorites_count = favorites_count - 1
    WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update favorites count
CREATE TRIGGER update_prompt_favorites_count
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_favorites_count();

-- Insert some seed data
INSERT INTO public.prompts (title, description, content, category, tags, is_featured) VALUES
(
  'Beautiful Landing Page',
  'Create a stunning, responsive landing page with modern animations and gradients',
  'Build a modern landing page with:
- Hero section with gradient background
- Smooth scroll animations
- Feature cards with hover effects
- CTA buttons with micro-interactions
- Mobile-responsive design
- Use Lovable''s design system colors',
  'ui_ux',
  ARRAY['landing-page', 'animations', 'responsive'],
  true
),
(
  'Authentication Flow',
  'Implement complete user authentication with email/password',
  'Set up authentication with:
- Login and signup pages
- Email/password authentication
- Protected routes
- User session management
- Profile page
- Auto-confirm email for testing
- Error handling and validation',
  'authentication',
  ARRAY['auth', 'supabase', 'security'],
  true
),
(
  'Dynamic Data Table',
  'Create a feature-rich data table with sorting, filtering, and pagination',
  'Build a data table component with:
- Sortable columns
- Search and filter functionality
- Pagination
- Row selection
- Export to CSV
- Responsive design
- Loading states',
  'components',
  ARRAY['table', 'data', 'ui'],
  true
),
(
  'Real-time Chat',
  'Implement a real-time chat system with Supabase',
  'Create a chat application with:
- Real-time message updates
- User presence indicators
- Message history
- Typing indicators
- File attachments support
- User avatars
- Message timestamps',
  'integrations',
  ARRAY['realtime', 'chat', 'supabase'],
  false
),
(
  'Form Validation',
  'Add comprehensive form validation with React Hook Form and Zod',
  'Implement form validation:
- Use React Hook Form
- Zod schema validation
- Custom error messages
- Async validation
- Field dependencies
- File upload validation
- Success/error states',
  'forms',
  ARRAY['validation', 'forms', 'zod'],
  false
);
