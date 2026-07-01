# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies (Node 18+ required)
npm run build     # static build to ./dist
npm run deploy    # build + push to Cloudflare Pages (requires wrangler auth)
```

There are no test or lint scripts — TypeScript strict-mode checking runs as part of the build.

## Design intent

The site is designed as a **MOOC (Massive Open Online Course)** — structured like Coursera or Khan Academy, not a docs site or blog. Key implications for any UI/UX or content work:

- **Learning path is sequential**: lessons have an `order` field; surface clear next-step navigation so learners always know what comes next.
- **Content hierarchy**: Domain → Lesson → Exercise → Practice Exam. Pages should reinforce this hierarchy visually.
- **Learner-first language**: headings, CTAs, and empty states should address the learner directly ("Start learning", "Try this exercise", "You're ready for the exam").
- **Bite-sized, scannable content**: lessons use section headers, callout boxes, diagrams, and summary bullets — not walls of prose.
- **Diagrams are first-class**: use Mermaid diagrams (rendered via CDN on lesson pages) to illustrate concepts wherever a picture beats prose. Lessons already include `mermaid` fenced code blocks — preserve and extend this pattern.
- **Practice before testing**: exercises reinforce each lesson; the practice exam comes last. Don't mix assessment UI with learning UI.
- **No login required**: the site is fully static and anonymous. Do not add auth, user accounts, or server-side state.

## Architecture

**Claude Code Academy** is a fully static Astro 6 site for studying Claude Code and preparing for the CCA-F exam. Zero backend — deploys free to Cloudflare Pages.

### Data flow

```
src/data/domains.ts                    ← single source of truth for 5 exam domain IDs + weights
src/content/{lessons,exercises,quiz}/  ← Zod-validated Markdown/JSON content
src/pages/                             ← Astro dynamic routes (getStaticPaths → static HTML)
src/layouts/Base.astro                 ← shared shell (nav, footer)
src/styles/global.css                  ← all site-wide styles; dark theme via CSS variables
```

Content is loaded by Astro's Content Collections API (Zod schemas in `src/content/config.ts`). Dynamic pages (`[...slug].astro`) pre-render all items at build time via `getStaticPaths()`. Client-side JS handles hint reveals and the quiz engine — no SSR, no localStorage state.

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
