 export interface ConversionConfig {
   features: {
     supabase: boolean;
     auth: boolean;
     reactRouter: boolean;
     tailwind: boolean;
     shadcn: boolean;
     tanstackQuery: boolean;
     apiIntegrations: boolean;
   };
   nextVersion: "14" | "15";
   projectType: "spa" | "dashboard" | "ecommerce" | "blog";
 }
 
 const BASE_PROMPT = (version: string) => `# Lovable/Vite to Next.js ${version} App Router Migration
 
 Convert this Lovable (Vite + React) project to Next.js ${version} with App Router.
 
 ## Initial Setup
 
 \`\`\`bash
 npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
 cd my-app
 \`\`\`
 
 ## Project Structure Conversion
 
 | Lovable/Vite | Next.js App Router |
 |--------------|-------------------|
 | src/pages/Index.tsx | app/page.tsx |
 | src/pages/About.tsx | app/about/page.tsx |
 | src/components/ | components/ (same) |
 | src/lib/ | lib/ (same) |
 | public/ | public/ (same) |
 | index.html | app/layout.tsx |
 
 `;
 
 const REACT_ROUTER_SECTION = `## React Router → Next.js File-Based Routing
 
 ### Remove React Router
 \`\`\`bash
 npm uninstall react-router-dom
 \`\`\`
 
 ### Routing Conversion Table
 
 | React Router | Next.js App Router |
 |--------------|-------------------|
 | \`<Route path="/">\` | \`app/page.tsx\` |
 | \`<Route path="/dashboard">\` | \`app/dashboard/page.tsx\` |
 | \`<Route path="/user/:id">\` | \`app/user/[id]/page.tsx\` |
 | \`<Route path="/blog/*">\` | \`app/blog/[...slug]/page.tsx\` |
 | \`useParams()\` | \`params\` prop or \`useParams()\` |
 | \`useNavigate()\` | \`useRouter()\` from next/navigation |
 | \`useLocation()\` | \`usePathname()\` + \`useSearchParams()\` |
 | \`<Link to="/">\` | \`<Link href="/">\` |
 | \`<Navigate to="/">\` | \`redirect("/")\` or \`useRouter().push()\` |
 
 ### Navigation Hook Migration
 
 \`\`\`tsx
 // Before (React Router)
 import { useNavigate, useParams, useLocation } from 'react-router-dom';
 
 function Component() {
   const navigate = useNavigate();
   const { id } = useParams();
   const location = useLocation();
   
   return <button onClick={() => navigate('/dashboard')}>Go</button>;
 }
 
 // After (Next.js)
 'use client';
 import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation';
 
 function Component() {
   const router = useRouter();
   const params = useParams();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   
   return <button onClick={() => router.push('/dashboard')}>Go</button>;
 }
 \`\`\`
 
 `;
 
 const SUPABASE_SECTION = `## Supabase SSR Migration
 
 ### Install Supabase SSR Package
 \`\`\`bash
 npm install @supabase/ssr @supabase/supabase-js
 \`\`\`
 
 ### Create Server Client (lib/supabase/server.ts)
 \`\`\`tsx
 import { createServerClient } from '@supabase/ssr';
 import { cookies } from 'next/headers';
 
 export async function createClient() {
   const cookieStore = await cookies();
 
   return createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         getAll() {
           return cookieStore.getAll();
         },
         setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) =>
               cookieStore.set(name, value, options)
             );
           } catch {}
         },
       },
     }
   );
 }
 \`\`\`
 
 ### Create Browser Client (lib/supabase/client.ts)
 \`\`\`tsx
 import { createBrowserClient } from '@supabase/ssr';
 
 export function createClient() {
   return createBrowserClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
 }
 \`\`\`
 
 ### Server Component Data Fetching
 \`\`\`tsx
 // app/dashboard/page.tsx (Server Component)
 import { createClient } from '@/lib/supabase/server';
 
 export default async function DashboardPage() {
   const supabase = await createClient();
   const { data: items } = await supabase.from('items').select('*');
   
   return <ItemList items={items} />;
 }
 \`\`\`
 
 `;
 
 const AUTH_SECTION = `## Authentication Migration
 
 ### Create Middleware (middleware.ts)
 \`\`\`tsx
 import { createServerClient } from '@supabase/ssr';
 import { NextResponse, type NextRequest } from 'next/server';
 
 export async function middleware(request: NextRequest) {
   let supabaseResponse = NextResponse.next({ request });
 
   const supabase = createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         getAll() {
           return request.cookies.getAll();
         },
         setAll(cookiesToSet) {
           cookiesToSet.forEach(({ name, value }) =>
             request.cookies.set(name, value)
           );
           supabaseResponse = NextResponse.next({ request });
           cookiesToSet.forEach(({ name, value, options }) =>
             supabaseResponse.cookies.set(name, value, options)
           );
         },
       },
     }
   );
 
   const { data: { user } } = await supabase.auth.getUser();
 
   // Protect routes
   if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
     const url = request.nextUrl.clone();
     url.pathname = '/login';
     return NextResponse.redirect(url);
   }
 
   return supabaseResponse;
 }
 
 export const config = {
   matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
 };
 \`\`\`
 
 ### Auth Callback Route (app/auth/callback/route.ts)
 \`\`\`tsx
 import { createClient } from '@/lib/supabase/server';
 import { NextResponse } from 'next/server';
 
 export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');
   const next = searchParams.get('next') ?? '/';
 
   if (code) {
     const supabase = await createClient();
     const { error } = await supabase.auth.exchangeCodeForSession(code);
     if (!error) {
       return NextResponse.redirect(\`\${origin}\${next}\`);
     }
   }
 
   return NextResponse.redirect(\`\${origin}/auth/error\`);
 }
 \`\`\`
 
 `;
 
 const TAILWIND_SECTION = `## Tailwind CSS Migration
 
 Tailwind works similarly in Next.js. Key changes:
 
 ### Update tailwind.config.ts
 \`\`\`tsx
 import type { Config } from "tailwindcss";
 
 const config: Config = {
   content: [
     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
     "./components/**/*.{js,ts,jsx,tsx,mdx}",
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
     extend: {
       // Copy your custom theme from Lovable
     },
   },
   plugins: [require("tailwindcss-animate")],
 };
 
 export default config;
 \`\`\`
 
 ### Move Global Styles
 - Copy \`src/index.css\` content to \`app/globals.css\`
 - Import in \`app/layout.tsx\`: \`import './globals.css'\`
 
 `;
 
 const SHADCN_SECTION = `## shadcn/ui Components
 
 ### Install shadcn/ui in Next.js
 \`\`\`bash
 npx shadcn@latest init
 \`\`\`
 
 ### Reinstall Components
 \`\`\`bash
 npx shadcn@latest add button card dialog form input
 # Add all components you used in Lovable
 \`\`\`
 
 ### Update Import Paths
 \`\`\`tsx
 // Lovable uses @/components/ui/
 // Next.js shadcn also uses @/components/ui/ by default
 // Imports should work as-is if you keep the same structure
 \`\`\`
 
 `;
 
 const TANSTACK_QUERY_SECTION = `## TanStack Query Migration
 
 ### Install Package
 \`\`\`bash
 npm install @tanstack/react-query
 \`\`\`
 
 ### Create Provider (app/providers.tsx)
 \`\`\`tsx
 'use client';
 
 import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import { useState } from 'react';
 
 export function Providers({ children }: { children: React.ReactNode }) {
   const [queryClient] = useState(() => new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 60 * 1000,
       },
     },
   }));
 
   return (
     <QueryClientProvider client={queryClient}>
       {children}
     </QueryClientProvider>
   );
 }
 \`\`\`
 
 ### Wrap in Layout (app/layout.tsx)
 \`\`\`tsx
 import { Providers } from './providers';
 
 export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
     <html lang="en">
       <body>
         <Providers>{children}</Providers>
       </body>
     </html>
   );
 }
 \`\`\`
 
 `;
 
 const API_SECTION = `## API Routes Migration
 
 ### Convert Edge Functions to Route Handlers
 
 | Lovable (Supabase Edge Functions) | Next.js Route Handlers |
 |-----------------------------------|------------------------|
 | supabase/functions/api/index.ts | app/api/[name]/route.ts |
 
 ### Example Route Handler (app/api/hello/route.ts)
 \`\`\`tsx
 import { NextResponse } from 'next/server';
 
 export async function GET(request: Request) {
   return NextResponse.json({ message: 'Hello from Next.js!' });
 }
 
 export async function POST(request: Request) {
   const body = await request.json();
   // Process request
   return NextResponse.json({ success: true });
 }
 \`\`\`
 
 ### Environment Variables
 - Copy \`.env\` values to \`.env.local\`
 - Prefix public variables with \`NEXT_PUBLIC_\`
 
 `;
 
 const CLIENT_DIRECTIVE_SECTION = `## Client vs Server Components
 
 ### Add 'use client' Where Needed
 
 Components that need \`'use client'\`:
 - useState, useEffect, useRef hooks
 - Event handlers (onClick, onChange)
 - Browser APIs (window, document)
 - Third-party client libraries
 
 \`\`\`tsx
 'use client';
 
 import { useState } from 'react';
 
 export function Counter() {
   const [count, setCount] = useState(0);
   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 }
 \`\`\`
 
 ### Keep as Server Components
 - Data fetching components
 - Static content
 - Components without interactivity
 
 `;
 
 const FINAL_CHECKLIST = (projectType: string) => `## Final Migration Checklist
 
 ### Project Type: ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}
 
 - [ ] Create Next.js project with App Router
 - [ ] Copy \`components/\` directory
 - [ ] Copy \`lib/\` utilities
 - [ ] Copy \`public/\` assets
 - [ ] Set up global styles
 - [ ] Configure environment variables
 - [ ] Add 'use client' to interactive components
 - [ ] Test all routes
 - [ ] Test authentication flow
 - [ ] Test data fetching
 - [ ] Run build: \`npm run build\`
 - [ ] Deploy to Vercel
 
 ## Need More Help?
 
 Paste specific component code and ask for targeted migration assistance.
 `;
 
 export function generateConversionPrompt(config: ConversionConfig): string {
   let prompt = BASE_PROMPT(config.nextVersion);
 
   if (config.features.reactRouter) {
     prompt += REACT_ROUTER_SECTION;
   }
 
   if (config.features.supabase) {
     prompt += SUPABASE_SECTION;
   }
 
   if (config.features.auth) {
     prompt += AUTH_SECTION;
   }
 
   if (config.features.tailwind) {
     prompt += TAILWIND_SECTION;
   }
 
   if (config.features.shadcn) {
     prompt += SHADCN_SECTION;
   }
 
   if (config.features.tanstackQuery) {
     prompt += TANSTACK_QUERY_SECTION;
   }
 
   if (config.features.apiIntegrations) {
     prompt += API_SECTION;
   }
 
   prompt += CLIENT_DIRECTIVE_SECTION;
   prompt += FINAL_CHECKLIST(config.projectType);
 
   return prompt;
 }