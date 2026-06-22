---
title: Prompt Engineering & Structured Output
domain: prompting
order: 1
minutes: 17
summary: Context engineering, being explicit, few-shot examples, getting reliable structured output, tool_use for structured output, validation-retry loops, the Message Batches API, and multi-instance review.
---

<div class="callout callout--why">
  <strong>Why this matters</strong>
  You paste a function into Claude and ask "does this have any bugs?" You get a paragraph: "This looks generally fine, though you might want to consider edge cases." You needed a list of specific issues with file and line numbers. The model is capable — the prompt wasn't specific enough. This lesson teaches you to write prompts that reliably produce what you actually need.
</div>

## Learning objectives

By the end of this lesson, you will be able to:

- Write prompts that produce consistent, reliable results by providing the right context and constraints
- Use few-shot examples to teach Claude a specific format or classification without lengthy prose descriptions
- Request structured JSON output that downstream programs can parse without breaking

## What is prompt engineering?

A **prompt** is any message you send to an AI model. **Prompt engineering** is the practice of writing prompts that reliably get the output you want.

Bad prompting is the most common reason AI outputs feel unhelpful or inconsistent — not because the model is incapable, but because it wasn't given enough information to succeed. Claude is powerful but literal: it does what you actually say, not what you meant to say.

This domain is **20%** of the exam and is the most immediately practiceable — every message you type in Claude Code is a prompt.

## Context engineering: what you put in matters more than how you phrase it

The biggest lever in modern prompting isn't clever wording — it's **what information you include**.

Claude can only work with what's in its context window (its "working memory" for the conversation). If a relevant file isn't included, Claude doesn't know about it. If you don't say what format you want, Claude will guess.

**Think of it like briefing a contractor who just walked in:**
- A bad brief: "Fix the bug."
- A good brief: "Here's the file with the bug (`auth.py`, lines 42–67). The bug causes login to fail when the email has a capital letter. Please fix it without changing the function signature."

The second brief gives Claude the file, the problem, the constraint, and the expected scope. That's context engineering.

**What to include:**
- The relevant files or code snippets
- The goal (what done looks like)
- Constraints (what not to change, what format to use)
- Examples if the output format is non-obvious

**What to leave out:**
- Unrelated files or history that don't affect this task
- Background information the model doesn't need

## Be explicit and specific

Claude follows instructions literally. Vague prompts produce vague results.

| Vague | Explicit |
|---|---|
| "Make it better" | "Refactor this function to reduce nesting — max 2 levels deep" |
| "Add some tests" | "Write unit tests for the `validateEmail` function covering: valid email, missing @, empty string" |
| "Fix the style" | "Format this file with 2-space indentation and single quotes" |

**Tips:**
- State the **goal**, the **constraints**, and the **output format** you want.
- Prefer positive instructions ("respond with only the JSON object") over negative ones ("don't include extra text") — tell Claude what to do, not what not to do.
- If steps matter, number them explicitly: "First do X, then Y, then Z."

## Explicit criteria for precision

A common mistake in review or classification prompts is using vague quality language — "be conservative," "only flag high-confidence issues," "don't be too strict." This almost never works.

The problem: vague instructions don't actually change what gets flagged. "Be conservative" means different things in different contexts. The model can't calibrate to a standard it can't measure against.

What works instead is **specific categorical criteria**:

| Vague | Specific |
|---|---|
| "Only flag high-confidence issues" | "Flag comments only when the claimed behavior contradicts the actual code behavior" |
| "Be conservative about security findings" | "Report only findings where the input reaches a sink without sanitization — skip issues that require chained errors to exploit" |
| "Skip minor issues" | "Skip style issues, naming conventions, and local patterns. Report only: logic bugs, security vulnerabilities, and data loss risks." |

**Why false positives erode trust:** If your review prompt flags minor style issues alongside real bugs, developers will start dismissing findings without reading them — including the accurate ones. Define precisely which categories to report and which to skip.

## Few-shot examples

Sometimes describing what you want in words is harder than just showing it. **Few-shot prompting** means providing 2–4 examples of input → output before asking for the real thing.

This is especially powerful for:
- Formatting (you want output in a specific shape)
- Classification (you want Claude to categorize things a specific way)
- Tone (you want a particular writing style)

**Example prompt:**
```
Convert each sentence to title case. Keep acronyms uppercase.

Input: the api returned an error
Output: The API Returned an Error

Input: user authentication failed
Output: User Authentication Failed

Input: loading mcp server configuration
Output:
```

The blank `Output:` at the end is intentional — that's what you actually send to Claude. You supply the completed examples to establish the pattern, then leave the final output empty. Claude fills it in (`Loading MCP Server Configuration` here).

Claude will imitate the pattern. Three examples is usually enough — the model learns the rule from demonstration.

**Keep examples consistent:** if your examples contain a mistake, Claude will reproduce it.

## Structured output (getting JSON back)

Many real applications need Claude to return data a program can parse — not prose, but a strict JSON object. Here's how to get it reliably:

**1. Describe the exact schema**
```
Return a JSON object with these fields:
- "name": string (the person's full name)
- "email": string (email address, or null if not found)
- "confidence": number between 0 and 1
```

**2. Provide one example**
```json
{"name": "Jane Smith", "email": "jane@example.com", "confidence": 0.95}
```

**3. Ask for only the JSON**
```
Return only the JSON object. No explanation, no markdown code fences.
```

If a downstream program is parsing the output, even one extra line of prose will break it.

**Design for missing information:** Use nullable fields (`"email": string | null`) for data that may not exist. Without nullable fields, the model is pressured to fabricate a value. With them, it can honestly return `null`.

**Extensible enums:** For category fields where you can't enumerate all possible values, use an `"other"` option paired with a detail string: `"category": "billing" | "technical" | "other"` plus `"category_detail": string`. This prevents the model from shoehorning an edge case into an ill-fitting category.

## A reliable prompt structure

When you need consistent results, structure your prompt in this order:

1. **Role / task** — what you want done ("You are a code reviewer. Review the following function for bugs.")
2. **Context** — the relevant data, files, or background
3. **Instructions** — constraints, steps, tone
4. **Examples** — few-shot, if the output shape is non-obvious
5. **Output format** — exact shape ("Return a JSON array of objects with `line` and `issue` fields.")

You don't need all five sections for every prompt — a simple task just needs a clear instruction. But for complex or repeated tasks, this structure prevents ambiguity.

## What to remember for the exam

- **Context engineering**: put the right information in the window; remove noise.
- Claude follows instructions literally — be explicit about goal, constraints, and output format.
- **Specific categorical criteria** beat vague quality adjectives ("be conservative"). Define which categories to report and skip.
- False positives erode trust in the accurate findings too — precision matters.
- **Few-shot examples** beat prose descriptions for teaching output format.
- For JSON: describe the schema, show an example, ask for only the object. Use nullable fields for missing data; use `"other"` + detail for extensible enums.
- Prefer positive instructions ("do X") over negative ones ("don't do Y").
- Continue to **Prompt Engineering — Advanced Patterns** for `tool_use`, validation-retry loops, the Message Batches API, and multi-instance review.
