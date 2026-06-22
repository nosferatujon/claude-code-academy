---
title: Coax reliable JSON out of Claude
domain: prompting
difficulty: beginner
estMinutes: 10
order: 1
intro: Practice writing a prompt that returns clean, parseable JSON matching an exact schema.
steps:
  - "Pick some unstructured text — a paragraph describing a person, or a product blurb."
  - "Write a prompt that asks Claude to extract fields into JSON, specifying the exact schema (field names, types, required/optional)."
  - "Include one example object so the shape is unambiguous."
  - "Instruct it to return only the JSON — no prose, no markdown fences."
  - "Run it, then tweak the prompt until the output parses on the first try every time."
hints:
  - "Name every field and its type; say which are required and what to do when a value is missing (e.g. `null`)."
  - "A single worked example is often worth more than a paragraph of rules."
  - "Negative instructions like 'no commentary' help, but positive framing ('respond with only the object') is clearer."
verify:
  - label: "If you saved the output to out.json, this confirms it parses as valid JSON."
    command: "cat out.json | python -m json.tool"
solution: |
  A prompt that produces reliable JSON:

  ```text
  Extract the following fields from the text below into a single JSON object.

  Schema:
  - name (string, required)
  - role (string, required)
  - years_experience (integer, or null if not stated)
  - skills (array of strings, [] if none)

  Example:
  {"name": "Ada Lovelace", "role": "Engineer", "years_experience": 12, "skills": ["math"]}

  Respond with ONLY the JSON object — no explanation, no markdown fences.

  Text:
  """
  Jordan is a senior data analyst with about 8 years in the field, strong in SQL and Python.
  """
  ```

  Expected output:

  ```json
  {"name": "Jordan", "role": "Senior Data Analyst", "years_experience": 8, "skills": ["SQL", "Python"]}
  ```

  The reliability comes from three things: an **explicit schema** (types + required/optional), a **concrete example** to anchor the shape, and a clear **output-only** instruction. Over the API you'd harden this further with tool use / structured outputs that *force* the schema.
---

**Why this matters:** Structured output is how agents hand data to other programs. The exam expects you to know that precise schemas, worked examples, and explicit output instructions drive reliability — and that the API offers tool use / structured outputs to guarantee the shape when correctness is critical.
