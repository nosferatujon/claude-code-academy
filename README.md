# Claude Code Academy

An interactive study site for learning **Claude Code** by doing, and preparing for the
**Claude Certified Architect – Foundations (CCA-F)** exam.

- **Hands-on exercises** — self-guided tasks you run in your own Claude Code terminal, with hints,
  self-check commands, and a reveal-able model solution. No Claude API key or Agent SDK required.
- **Lessons** — short readings covering all five exam domains, including the Agent SDK / API
  concepts you can't run locally but still need to know.
- **Practice exam** — a client-side quiz that samples questions using the real exam's domain
  weighting and scores you against the 72% pass mark.
- **Progress tracking** — stored in your browser (`localStorage`); no accounts, no backend.

It's a fully static Astro site, so it runs free on **Cloudflare Pages** with no Workers, no
database, and no server-side code.

## The five exam domains

| Domain | Weight |
| --- | --- |
| Agentic Architecture & Orchestration | 27% |
| Prompt Engineering & Structured Output | 20% |
| Claude Code Configuration & Workflows | 20% |
| Tool Design & MCP Integration | 18% |
| Context Management & Reliability | 15% |

## Build

```bash
npm install
npm run build    # outputs static site to ./dist
npm run deploy   # build + deploy to Cloudflare Pages
```

Requires Node 18+ (built and tested on Node 24).

## Project structure

```
src/
  data/domains.ts           # the 5 domains, weights, blurbs (single source of truth)
  content.config.ts         # content collection schemas
  content/
    lessons/*.md            # one file per lesson
    exercises/*.md          # one file per exercise
    quiz/questions.json     # the practice-exam question pool
  layouts/Base.astro        # shared shell, nav, <head>
  pages/                    # dashboard, lessons, exercises, exam, progress
  styles/global.css
public/
  progress.js               # client-side localStorage progress tracking
```

## Adding content (no code changes needed)

### A new lesson

Create `src/content/lessons/my-lesson.md`:

```markdown
---
title: My Lesson Title
domain: workflows        # agentic | prompting | workflows | mcp | context
order: 2
minutes: 6
summary: One-line summary shown on the lessons index.
---

Markdown body…
```

### A new exercise

Create `src/content/exercises/my-exercise.md`:

```markdown
---
title: My Exercise
domain: mcp
difficulty: beginner     # beginner | intermediate | advanced
estMinutes: 12
order: 2
intro: One-line description of the task.
steps:
  - "First step (Markdown inline formatting allowed)."
  - "Second step."
hints:
  - "An optional hint."
verify:                  # optional self-check commands
  - label: "What this command confirms."
    command: "ls somefile"
solution: |
  Markdown for the reveal-able model solution.
  Code blocks work here too.
---

Optional background paragraph rendered above the task.
```

### A new exam question

Append an object to the array in `src/content/quiz/questions.json`:

```json
{
  "id": "unique-kebab-id",
  "domain": "context",
  "difficulty": "intermediate",
  "question": "The question text?",
  "options": ["A", "B", "C", "D"],
  "answer": 2,
  "explanation": "Why the correct option is correct."
}
```

`answer` is the 0-based index of the correct option. The exam auto-balances how many questions it
draws per domain based on the weights in `src/data/domains.ts`.

> Note: because this is a static study tool, quiz answers are present in the page source. That's an
> accepted trade-off for a free, backend-free site.

## Deploy to Cloudflare Pages (free tier)

You have two options.

### Option A — Git integration (recommended, auto-deploys on push)

1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo and set the build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save & Deploy. Every push to the production branch rebuilds and deploys automatically.

The free plan covers unlimited static requests/bandwidth and 500 builds/month — plenty for this.

### Option B — Direct upload with Wrangler

```bash
npm run build
npx wrangler pages deploy dist --project-name=claude-code-academy
```

The first run prompts you to log in to Cloudflare and creates the Pages project. The repo's
`npm run deploy` script does both steps together.

## License / disclaimer

Unofficial study material, not affiliated with or endorsed by Anthropic. Verify exam details
against Anthropic's official certification pages before testing.
