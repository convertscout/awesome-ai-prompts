# Supabase Auth Setup for Lovable

> Complete authentication flow with signup, login, and protected routes

## Prompt

```
Create a complete authentication system with:

1. Auth pages:
   - /auth page with login/signup tabs
   - Email and password authentication
   - Form validation with error messages
   - Loading states during auth operations

2. Protected routes:
   - Create an AuthProvider context
   - Wrap protected routes with auth check
   - Redirect to /auth if not logged in
   - Redirect to /dashboard after login

3. User profile:
   - Create profiles table linked to auth.users
   - Display user info in navbar
   - Logout button functionality

4. Security:
   - Enable RLS on all user tables
   - Policies for users to only access their own data

Use Supabase client from @/integrations/supabase/client
Use shadcn/ui components for forms
Use react-router-dom for navigation
Use sonner for toast notifications
```

## Usage

- **Best for:** Lovable
- **Category:** Authentication
- **Difficulty:** Intermediate

## Example Output

Creates complete auth system with:
- Login/Signup forms
- Session management
- Protected route wrapper
- User profile display

## Tips

- Make sure Supabase is connected in your Lovable project
- Enable auto-confirm for development
- Test with multiple user accounts

## Author

- [Lovable Directory](https://lovable.directory)
