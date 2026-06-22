---
title: Build a validation-retry loop
domain: prompting
difficulty: advanced
estMinutes: 25
order: 5
intro: Implement a retry loop that catches extraction failures, sends specific feedback back to the model, and learns when retrying is pointless because the information simply isn't there.
steps:
  - "Write an extraction prompt for invoice data: `vendor`, `amount`, `due_date`, `invoice_number` — all required."
  - "Test it on an invoice snippet where `due_date` is absent from the text. Observe: the model either hallucinates a date or returns null (depending on your instructions)."
  - "Write a validator that checks every required field is present and non-null, and produces a specific error message identifying which field failed and why."
  - "Implement the retry: append the failed extraction + the error message to the conversation, then re-send. The error message must name the field and describe the problem — vague messages ('try again') rarely help."
  - "Run the retry and observe the improved extraction."
  - "Now test with a document where the information is genuinely absent (e.g. a document that says 'payment due upon receipt' instead of a specific date). Observe that retrying does not help — the model produces the same null result."
  - "Add a max_retries guard and a final fallback: after exhausting retries, surface the partial result with a clear flag indicating which fields could not be extracted."
hints:
  - "Retry is effective when the model had the information but formatted it incorrectly, missed it, or misunderstood the schema."
  - "Retry is ineffective when the source document genuinely does not contain the field. Repeated attempts produce the same result."
  - "The retry message should be specific: 'due_date was null but the invoice says Net 30 from 2024-03-15' gives the model exactly what it needs to correct itself."
  - "Use `tool_use` with a forced schema (see the structured-json-output exercise) so the retry always produces a parseable object — not a prose apology."
  - "Cap retries at 2–3. More than that rarely improves results and wastes tokens."
verify:
  - label: "Confirms the retry script exists."
    command: "ls retry-extract.*"
solution: |
  `retry-extract.py`:

  ```python
  import anthropic
  import json

  client = anthropic.Anthropic()

  INVOICE_TOOL = {
      "name": "extract_invoice",
      "description": "Extract structured invoice data from text.",
      "input_schema": {
          "type": "object",
          "properties": {
              "vendor":         {"type": ["string", "null"]},
              "amount":         {"type": ["number", "null"]},
              "due_date":       {"type": ["string", "null"], "description": "ISO 8601 date or null"},
              "invoice_number": {"type": ["string", "null"]}
          },
          "required": ["vendor", "amount", "due_date", "invoice_number"]
      }
  }

  def validate(result: dict) -> list[str]:
      """Return a list of specific error messages, empty if valid."""
      errors = []
      for field in ["vendor", "amount", "due_date", "invoice_number"]:
          if result.get(field) is None:
              errors.append(f"'{field}' is null — re-read the document for this value")
      return errors

  def extract_with_retry(document: str, max_retries: int = 2) -> dict:
      messages = [{"role": "user", "content": f"Extract invoice data:\n\n{document}"}]

      for attempt in range(max_retries + 1):
          response = client.messages.create(
              model="claude-opus-4-5",
              max_tokens=512,
              tools=[INVOICE_TOOL],
              tool_choice={"type": "tool", "name": "extract_invoice"},
              messages=messages
          )
          result = response.content[0].input
          errors = validate(result)

          if not errors:
              return {"data": result, "attempts": attempt + 1, "complete": True}

          if attempt < max_retries:
              # Append assistant turn (the failed extraction)
              messages.append({"role": "assistant", "content": response.content})
              # Append specific corrective feedback
              feedback = (
                  f"Extraction attempt {attempt + 1} had validation errors:\n"
                  + "\n".join(f"- {e}" for e in errors)
                  + "\n\nPlease re-read the original document and try again."
              )
              messages.append({"role": "user", "content": feedback})

      # Exhausted retries — return partial result with flag
      return {"data": result, "attempts": max_retries + 1, "complete": False, "missing": errors}


  # Test 1: missing due_date — retry should find "Net 30" pattern
  invoice_with_implicit_date = """
  INVOICE #INV-2024-0042
  Vendor: Acme Supplies Ltd.
  Amount due: $1,250.00
  Terms: Net 30 from invoice date 2024-03-15
  """

  r1 = extract_with_retry(invoice_with_implicit_date)
  print("Test 1 (implicit date):", json.dumps(r1, indent=2))

  # Test 2: due_date genuinely absent — retry will not help
  invoice_no_date = """
  INVOICE #INV-2024-0043
  Vendor: Beta Services
  Amount: $500.00
  Payment due upon receipt.
  """

  r2 = extract_with_retry(invoice_no_date)
  print("Test 2 (no date in source):", json.dumps(r2, indent=2))
  # complete: false, missing: ["'due_date' is null — ..."]
  ```

  What you should observe:

  - **Test 1:** The model missed "Net 30 from 2024-03-15" on the first pass. The retry error message names the field and points back to the source. On retry, the model finds the implicit date.
  - **Test 2:** "Payment due upon receipt" has no extractable date. Every retry produces `due_date: null`. The loop exhausts its retries and returns `complete: false` with the partial result — the right behavior rather than an infinite loop or a hallucinated date.

  The key distinction:

  | Situation | Retry helps? | Why |
  |-----------|-------------|-----|
  | Model misread a value | Yes | The information exists; specific feedback guides a re-read |
  | Wrong output format | Yes | The model can reformat what it already found |
  | Information genuinely absent | No | The source document doesn't contain it; retrying produces the same null |
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Python 3.8+ installed. An Anthropic API key set as the <code>ANTHROPIC_API_KEY</code> environment variable. Completing <strong>Coax reliable JSON out of Claude</strong> first is strongly recommended.
</div>

**Why this matters:** Retry loops are a critical reliability pattern for extraction agents. The exam tests both the mechanics (appending failed result + specific error message to the conversation) and the judgment call — knowing that retry is ineffective when the source is silent, and that a partial result with a clear `complete: false` flag is more honest than a hallucinated value.
