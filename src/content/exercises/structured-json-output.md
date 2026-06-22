---
title: Coax reliable JSON out of Claude
domain: prompting
difficulty: beginner
estMinutes: 15
order: 1
intro: Practice the three tiers of JSON reliability — prompt-based, tool_use schema enforcement, and validation-retry loops.
steps:
  - "Pick some unstructured text — a paragraph describing a person, or a product blurb."
  - "Write a prompt that asks Claude to extract fields into JSON, specifying the exact schema (field names, types, required/optional). Include one example object so the shape is unambiguous."
  - "Instruct it to return only the JSON — no prose, no markdown fences. Note: this works most of the time but is not guaranteed."
  - "Now upgrade to the most reliable approach: define the schema as a JSON Schema object and pass it as a `tool` definition in the API call. Set `tool_choice` to force Claude to use that tool. The output is now structurally guaranteed."
  - "In your tool schema, mark any field that might be absent as nullable (`'type': ['string', 'null']`) rather than just optional. This prevents Claude from hallucinating a value when the source text is silent."
  - "Implement a validation-retry loop: parse the output, check required fields, and if validation fails, send back the original document + the failed extraction + a specific error message. Observe the improved result on retry."
hints:
  - "Name every field and its type; say which are required and what to do when a value is missing (e.g. `null`)."
  - "A single worked example is often worth more than a paragraph of rules."
  - "Tier 1 (prompt): works well, not guaranteed. Tier 2 (tool_use): structurally guaranteed by the API. Tier 3 (retry loop): corrects semantic errors prompt and schema alone cannot catch."
  - "Nullable fields (`['string', 'null']`) are key — without them, Claude may invent a value rather than emit null."
  - "The retry message should be specific: 'years_experience was null but the text said eight years' tells the model exactly what went wrong."
verify:
  - label: "If you saved the output to out.json, this confirms it parses as valid JSON."
    command: "cat out.json | python -m json.tool"
solution: |
  **Tier 1 — Prompt-based (fast, not guaranteed):**

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

  **Tier 2 — tool_use with JSON Schema (structurally guaranteed):**

  ```python
  import anthropic

  client = anthropic.Anthropic()

  tools = [{
      "name": "extract_person",
      "description": "Extract structured person data from text.",
      "input_schema": {
          "type": "object",
          "properties": {
              "name": {"type": "string"},
              "role": {"type": "string"},
              "years_experience": {"type": ["integer", "null"]},
              "skills": {"type": "array", "items": {"type": "string"}}
          },
          "required": ["name", "role", "years_experience", "skills"]
      }
  }]

  response = client.messages.create(
      model="claude-opus-4-5",
      max_tokens=1024,
      tools=tools,
      tool_choice={"type": "tool", "name": "extract_person"},
      messages=[{
          "role": "user",
          "content": "Extract: Jordan is a senior data analyst with about 8 years in the field, strong in SQL and Python."
      }]
  )

  result = response.content[0].input  # guaranteed to match the schema
  ```

  Key points about this approach:

  - `tool_choice: {"type": "tool", "name": "extract_person"}` **forces** Claude to call this tool — it cannot emit prose instead.
  - `years_experience: {"type": ["integer", "null"]}` makes the field nullable — Claude emits `null` when the value is absent rather than guessing.
  - The API validates the output against the schema before returning it.

  **Tier 3 — Validation-retry loop:**

  ```python
  import json

  def extract_with_retry(text, max_retries=2):
      messages = [{"role": "user", "content": f"Extract: {text}"}]

      for attempt in range(max_retries + 1):
          response = client.messages.create(
              model="claude-opus-4-5",
              max_tokens=1024,
              tools=tools,
              tool_choice={"type": "tool", "name": "extract_person"},
              messages=messages
          )
          result = response.content[0].input

          # Semantic validation (schema won't catch this)
          errors = []
          if result.get("years_experience") is None and "year" in text.lower():
              errors.append("years_experience was null but the source text mentions years of experience")

          if not errors:
              return result  # success

          if attempt < max_retries:
              # Append the failed attempt and the specific error to the conversation
              messages.append({"role": "assistant", "content": response.content})
              messages.append({
                  "role": "user",
                  "content": f"The extraction had errors: {'; '.join(errors)}. Please re-extract from the original text."
              })

      return result  # return best effort after retries
  ```

  The retry message must be **specific** — vague feedback ("try again") rarely improves results. Telling the model exactly which field failed and why gives it the information it needs to correct the extraction.
---

**Why this matters:** Structured output is how agents hand data to other programs. The exam expects you to know all three tiers: prompt-based (reliable but not guaranteed), tool_use with JSON Schema (structurally guaranteed by the API), and validation-retry loops for semantic errors. Nullable fields and forced tool_choice are the two most commonly tested implementation details.
