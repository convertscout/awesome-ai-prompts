

# Pivot to "Lovable Directory" - Full Rebrand Strategy

## The Honest Situation

- 3 months live, only 8 signups, ~6 total clicks
- The ONLY queries getting clicks are Lovable-specific: "lovable ui prompts", "lovable directory", "lovable to next.js conversion"
- Generic queries like "chatgpt prompts", "cursor rules" have massive competition from established sites
- Your domain IS literally "lovabledirectory.site" - Google already associates you with Lovable

## The Strategy: Own "Lovable" as a Niche

Stop competing for generic AI prompts (thousands of competitors) and become THE resource for Lovable.dev users. There are ~500K+ Lovable users and no dedicated third-party resource site.

---

## What Changes

### 1. Homepage Rebrand (Index.tsx)

**Before:** "Vibe Coding Directory - Free AI Prompts & Cursor Rules 2025"
**After:** "Lovable Directory - Prompts, Templates & Tools for Lovable.dev"

- H1: "Lovable Directory"
- Subtitle: "The #1 resource for Lovable.dev prompts, UI templates, and migration tools"
- Replace generic "Popular Languages" section with Lovable-specific categories: "UI Prompts", "SaaS Templates", "Hallucination Fixes", "Migration Tools", "Best Practices", "Component Prompts"
- Homepage FAQ schema rewritten around Lovable questions
- Feature the Lovable-to-Next.js tool and Lovable UI prompts prominently

### 2. Navigation Rebrand (Navigation.tsx)

**Before:** Generic links (Rules, MCP, Job, Codes)
**After:** Lovable-focused navigation:
- "UI Prompts" (primary link)
- "Templates" (browse Lovable prompts)
- "Tools" (conversion tool, generator)
- "Submit"
- Keep "More" dropdown for other tool prompts (Cursor, ChatGPT etc.) as secondary

### 3. Update SEO Metadata Across All Pages

Every page that references "Vibe Coding Directory" or generic branding gets updated to reference "Lovable Directory":
- `Index.tsx` - full rebrand
- `Generate.tsx` - "Lovable Prompt Generator" focus
- `Advertise.tsx` - "Advertise with Lovable Directory"
- All canonical URLs remain `lovabledirectory.site`

### 4. Update robots.txt

- Update site name reference from "Vibe Coding" to "Lovable Directory"
- Keep all AI crawler rules (already good)

### 5. Update llms.txt

Full rebrand:
- Title: "Lovable Directory"
- Description: "The largest resource for Lovable.dev prompts, templates, and tools"
- Reorganize sections to lead with Lovable content
- Keep other tool prompts as secondary sections

### 6. Update Sitemap

- Boost `/lovable-prompts` and `/lovable-ui-prompts` to priority 1.0
- Keep `/lovable-to-nextjs` at 1.0
- Demote generic pages (chatgpt-prompts, gemini-prompts etc.) to 0.7
- Add `/lovable-ui-prompts` explicitly if missing

### 7. Monetization Reality Check

The $2,000/month sponsorship with "200K monthly views" and "19K newsletter subscribers" claims on the Advertise page are not realistic with 6 clicks in 3 months. This needs honest numbers or removal until traffic justifies it.

**Updated monetization approach:**
- Lower the sponsorship price to something achievable ($100-200/month to start)
- Or remove the Advertise page entirely until you have real traffic
- Focus on the AI generator as a freemium product (already built)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Full rebrand - title, subtitle, categories, FAQ schema |
| `src/components/Navigation.tsx` | Lovable-focused nav links |
| `src/pages/Generate.tsx` | Update title/description to Lovable focus |
| `src/pages/Advertise.tsx` | Update stats to be honest, or simplify |
| `public/robots.txt` | Update site name |
| `public/llms.txt` | Full rebrand |
| `supabase/functions/sitemap/index.ts` | Reprioritize for Lovable pages |
| `src/plugins/sitemap-generator.ts` | Match sitemap priorities |

---

## What NOT to Delete

Keep all existing pages (ChatGPT, Cursor, Claude, etc.) - they still serve as supplementary content and potential long-tail traffic. But they become secondary to the Lovable-first identity.

---

## Expected Outcome

- Stronger brand signal to Google for "lovable" queries
- Lower competition (no one else owns "lovable directory" or "lovable prompts")
- Better user intent match: people searching "lovable" queries land on a site called "lovabledirectory.site"
- Foundation to build real traffic before scaling monetization

