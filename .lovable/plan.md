
# SEO Optimization Plan for High Organic Traffic

## Analysis of Your Search Impressions

Based on your Google Search Console data, here are the queries you're getting impressions for:

| Query | Current Status | Opportunity |
|-------|----------------|-------------|
| **lovable directory** | Branded - already ranking | Strengthen brand dominance |
| **text chunking** | No dedicated page | Create dedicated content |
| **best llm for coding** | Partial coverage | Enhance existing BestAIForCoding page |
| **cursor ide superwhisper transcription integration setup** | No content | Create integration guide |
| **lovable to next.js conversion prompt** | Have content in DB | Create dedicated landing page |
| **lovable.dev to next.js conversion prompt** | Have content in DB | Same as above |
| **cursor ide superwhisper integration transcribe setup** | No content | Create integration guide |
| **encore mcp cursor** | No dedicated content | Create MCP page targeting this |
| **"cursor" "llm"** | Partial coverage | Enhance Cursor prompts page |

---

## Phase 1: Create New SEO Landing Pages

### 1.1 Lovable to Next.js Conversion Page
**Route:** `/lovable-to-nextjs`
**Target Keywords:** 
- "lovable to next.js conversion" 
- "lovable.dev to next.js"
- "lovable export nextjs"

You already have this content in database:
- "Lovable to Next.js Conversion Prompts 2025: Vite to App Router Migration"
- "Building Full-Stack Apps with Lovable and Next.js"
- Multiple Next.js Cursor Rules

**Page Structure:**
- H1: "Lovable to Next.js Conversion Guide 2025"
- Step-by-step conversion process
- Featured prompts from database
- FAQ schema for rich snippets

### 1.2 Text Chunking for AI Page
**Route:** `/text-chunking`
**Target Keywords:**
- "text chunking"
- "text chunking for RAG"
- "AI text chunking strategies"

Content from database:
- "Best Cursor Rules 2025 for RAG Embeddings: Chunking and Vector Search"

**Page Structure:**
- H1: "Text Chunking for AI: Complete Guide 2025"
- Explain chunking strategies (fixed, semantic, recursive)
- Link to RAG prompts
- Practical examples

### 1.3 Cursor + SuperWhisper Integration Page
**Route:** `/cursor-superwhisper-integration`
**Target Keywords:**
- "cursor ide superwhisper integration"
- "cursor superwhisper transcription"
- "voice coding cursor"

**Page Structure:**
- H1: "Cursor + SuperWhisper Integration Guide: Voice Coding Setup"
- Step-by-step setup instructions
- Voice command examples
- Related Cursor rules/prompts

### 1.4 MCP Directory Page
**Route:** `/mcp-directory` or enhance existing MCP section
**Target Keywords:**
- "encore mcp cursor"
- "mcp cursor"
- "model context protocol cursor"

Content from database (18+ MCP-related prompts):
- "Setup n8n MCP Server Integration"
- "MCP Chain for Cursor Hallucination Fixes"
- "MCP Chain for Lovable-to-Cursor Handoff Workflows"
- Multiple other MCP chains

**Page Structure:**
- H1: "MCP Directory: Model Context Protocol for Cursor & AI Tools"
- Categorized MCP listings
- Search/filter functionality
- Popular MCPs featured

---

## Phase 2: Enhance Existing Pages

### 2.1 Update BestAIForCoding.tsx
Add content for "best llm for coding" query:
- Add section: "Best LLMs for Cursor IDE"
- Include comparison table: Claude vs GPT-4 vs Gemini for Cursor
- Add FAQ: "Which LLM should I use with Cursor?"

### 2.2 Enhance CursorPrompts.tsx
Target "cursor llm" queries:
- Add section: "Cursor + LLM Integration Prompts"
- Link to specific LLM-focused Cursor rules
- Add FAQ about LLM selection for Cursor

### 2.3 Homepage SEO Updates
- Update meta description to include "vibe coding" prominently
- Add FAQ schema targeting "lovable directory" searches
- Ensure H1 is "Vibe Coding Directory" (already done)

---

## Phase 3: Update robots.txt

```text
User-agent: *
Allow: /

# Disallow private/auth pages
Disallow: /auth
Disallow: /profile
Disallow: /favorites

# AI Crawlers - Welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap
Sitemap: https://lovabledirectory.site/sitemap.xml

# LLMs.txt for AI systems
# Full content: https://nkbtvxoojkllafmjjhis.supabase.co/functions/v1/llms-full
```

---

## Phase 4: Update llms.txt

Update `public/llms.txt` to:
- Change branding to "Vibe Coding Directory"
- Add new pages (Lovable to Next.js, Text Chunking, MCP Directory)
- Include keyword-rich descriptions

---

## Phase 5: Update Sitemap Generator

Modify `supabase/functions/sitemap/index.ts` to add new pages:

```text
New pages to add:
- /lovable-to-nextjs (priority 0.9)
- /text-chunking (priority 0.8)
- /cursor-superwhisper-integration (priority 0.8)
- /mcp-directory (priority 0.9)
```

Also update `src/plugins/sitemap-generator.ts` static pages array.

---

## Phase 6: Internal Linking Strategy

Add internal links from existing high-traffic pages:
- CursorPrompts.tsx → Link to new MCP Directory, SuperWhisper guide
- LovablePrompts.tsx → Link to Lovable-to-Next.js conversion
- BestAIForCoding.tsx → Link to Text Chunking, LLM comparison

---

## Summary of Files to Create/Modify

### New Files (4 new pages):
1. `src/pages/LovableToNextjs.tsx` - Conversion guide
2. `src/pages/TextChunking.tsx` - Text chunking guide
3. `src/pages/CursorSuperWhisperIntegration.tsx` - Voice coding setup
4. `src/pages/MCPDirectory.tsx` - MCP listings page

### Modified Files:
1. `src/App.tsx` - Add new routes
2. `src/pages/BestAIForCoding.tsx` - Add LLM comparison section
3. `src/pages/CursorPrompts.tsx` - Add LLM integration section
4. `public/robots.txt` - Add AI crawlers, update sitemap URL
5. `public/llms.txt` - Update branding and add new pages
6. `supabase/functions/sitemap/index.ts` - Add new pages
7. `supabase/functions/robots/index.ts` - Update with AI crawlers
8. `src/plugins/sitemap-generator.ts` - Add new static pages

---

## Expected Results

| Query | Action | Expected Improvement |
|-------|--------|---------------------|
| lovable directory | Brand reinforcement | Maintain/improve position 1 |
| text chunking | New dedicated page | First page ranking in 2-4 weeks |
| best llm for coding | Enhanced content | Move from impressions to clicks |
| cursor superwhisper | New dedicated page | Capture niche traffic |
| lovable to next.js | New dedicated page | First page ranking (low competition) |
| encore mcp cursor | MCP directory page | Capture MCP-related searches |
| cursor + llm | Enhanced Cursor page | Improved CTR |

---

## Technical Notes

- All new pages will include proper FAQ schema for rich snippets
- Each page will use the `useSEO` hook for dynamic meta tags
- Breadcrumb schema will be added to all new pages
- Internal linking will create topic clusters around Cursor, Lovable, and LLMs
