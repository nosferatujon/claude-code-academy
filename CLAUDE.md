# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies (Node 18+ required)
npm run dev       # dev server at http://localhost:4321
npm run build     # static build to ./dist
npm run preview   # serve production build locally
npm run deploy    # build + push to Cloudflare Pages (requires wrangler auth)
```

There are no test or lint scripts — TypeScript strict-mode checking runs as part of the build.

## Architecture

**Claude Code Academy** is a fully static Astro 6 site for studying Claude Code and preparing for the CCA-F exam. Zero backend — deploys free to Cloudflare Pages.

### Data flow

```
src/data/domains.ts          ← single source of truth for 5 exam domain IDs + weights
src/content/{lessons,exercises,quiz}/  ← Zod-validated Markdown/JSON content
src/pages/                   ← Astro dynamic routes (getStaticPaths → static HTML)
public/progress.js           ← window.Progress API backed by localStorage key cca_progress_v1
```

Content is loaded by Astro's Content Collections API (Zod schemas in `src/content/config.ts`). Dynamic pages (`[...slug].astro`) pre-render all items at build time via `getStaticPaths()`. Client-side JS handles progress toggling, hint reveals, and the quiz engine — no SSR.

### Adding content (no code changes needed)

**Lesson** — create `src/content/lessons/<slug>.md` with frontmatter:
```yaml
title, domain, order, minutes, summary
```

**Exercise** — create `src/content/exercises/<slug>.md` with frontmatter:
```yaml
title, domain, difficulty, estMinutes, order, intro
steps: []        # Markdown strings
hints: []        # optional
verify: []       # [{label, command}] — shell commands users run to self-check
solution: |      # fenced Markdown, rendered client-side by marked
```

**Quiz question** — append to `src/content/quiz/questions.json`:
```json
{ "id": "kebab-id", "domain": "...", "difficulty": "...",
  "question": "...", "options": ["A","B","C","D"], "answer": 2, "explanation": "..." }
```
`answer` is a 0-based index. The exam auto-balances question count per domain using the weights in `src/data/domains.ts`.

### Key conventions

- **Domain IDs** (`agentic | prompting | workflows | mcp | context`) are defined once in `src/data/domains.ts`; all frontmatter `domain` fields must match exactly.
- **Content slugs** come from filenames — use kebab-case.
- **Quiz answers are in page source** — accepted trade-off for a backend-free architecture.
- **No build-time randomization** — quiz shuffling is client-side only.
- `public/progress.js` is loaded by `src/layouts/Base.astro` and exposes `window.Progress`; the dashboard listens for the `progress-change` custom event to repaint domain bars.
