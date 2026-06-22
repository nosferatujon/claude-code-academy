---
title: Prompt Engineering & Structured Output
domain: prompting
order: 1
minutes: 7
summary: Context engineering, being explicit, few-shot examples, and getting reliable structured output like JSON from Claude.
---

This domain (**20%**) is very practiceable in Claude Code — every message you send is a prompt.

## Context engineering, not just prompt wording

Modern prompting is less about magic phrases and more about *what context you put in the window*: the right files, the goal, constraints, and examples. Give Claude what a new teammate would need and nothing that just adds noise.

## Be explicit and specific

Claude follows instructions literally. Vague asks get vague results.

- State the **goal**, the **constraints**, and the **format** you want.
- Prefer positive instructions ("respond with only the JSON object") over negative ones.
- When order or steps matter, say so.

## Few-shot examples

Showing 2–4 examples of input → desired output is often more effective than describing the rules in prose, especially for formatting and edge cases. Keep examples representative and consistent — the model imitates their style.

## Structured output (JSON)

When you need machine-readable output:

- Describe the **exact schema**: field names, types, and which are required.
- Provide one example object.
- Ask for *only* the JSON, with no prose or markdown fences, if a program will parse it.
- For high reliability via the API you would use **tool use / structured outputs** to force the shape; in Claude Code you achieve similar results by specifying the schema precisely and validating the result.

## Prompt structure that works

A reliable template:

1. **Role / task** — what you want done
2. **Context** — relevant data, files, background
3. **Instructions** — constraints, steps, tone
4. **Examples** — few-shot, if useful
5. **Output format** — exact shape

## What to remember for the exam

- Put the right context in the window; remove noise.
- Be explicit about goal, constraints, and output format.
- Few-shot examples beat prose for formatting tasks.
- For JSON, specify the schema exactly and ask for only the object.
