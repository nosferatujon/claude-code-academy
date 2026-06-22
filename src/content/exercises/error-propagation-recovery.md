---
title: Prompt for error recovery & retries
domain: context
difficulty: intermediate
estMinutes: 15
order: 3
intro: Design a validation-retry prompt that instructs Claude to recover from a schema validation failure without fabricating missing data.
steps:
  - "Assume you have a JSON extraction pipeline where Claude returned: `{\"date\": \"June 3rd, 2024\", \"id\": null}`."
  - "Your system expects the date in ISO 8601 (`YYYY-MM-DD`) format. The `id` is missing from the source document entirely."
  - "Now, write a prompt to simulate the validation retry step. Present the original source document, the failed output, and the specific validation error."
  - "Instruct Claude to correct the date format. Explicitly direct it NOT to fabricate the `id` field, but to leave it as `null` since the source document doesn't contain it."
  - "Verify that Claude returns a corrected JSON object with a properly formatted date and `id: null`, rather than guessing a random ID."
  - "Reflect: what would happen if you didn't explicitly forbid fabrication of missing fields during retries?"
hints:
  - "When retrying, feed the specific error back (e.g. 'date format is invalid') rather than a generic 'please try again'."
  - "Models feel pressure to satisfy schemas. If a schema requires a field but the source document lacks it, the model will fabricate it unless you offer a safe out (like nullable fields or explicit instructions not to invent data)."
  - "If the information is simply not in the source text, abort rather than retrying, because retrying is highly likely to cause hallucination/fabrication."
verify:
  - label: "Confirms the lesson content matches the retry logic principles."
    command: "grep -n \"Validation-retry loops\" src/content/lessons/prompt-engineering-advanced.md"
solution: |
  Designing a validation-retry prompt:

  **1. The Scenario:**
  Source document:
  ```text
  Invoice processed for Acme Corp. Total due is $150.00. Payment due upon receipt.
  ```
  Expected Schema:
  `{ invoice_number: string | null, total: number }`

  **2. The Initial Output (Incorrect / Incomplete):**
  ```json
  { "invoice_number": "unknown", "total": 150 }
  ```
  *Error: The `invoice_number` is absent in the source text, but the model wrote `"unknown"` instead of returning `null` as permitted by the type `string | null`.*

  **3. The Retry Prompt (Correct pattern):**
  ```text
  You are an extraction parser. Your previous extraction failed validation.
  
  Source Document:
  "Invoice processed for Acme Corp. Total due is $150.00. Payment due upon receipt."

  Previous Output:
  { "invoice_number": "unknown", "total": 150 }

  Validation Error:
  - "invoice_number" must be a valid string identifier or null. Do not use placeholder strings like "unknown" or fabricate numbers. If the invoice number is not in the source text, return null.

  Correct the output and return only the JSON object.
  ```

  **4. Expected Claude response:**
  ```json
  { "invoice_number": null, "total": 150.00 }
  ```

  **Key Takeaways for the Exam:**
  * **Retrying formatting errors works:** Dates, telephone numbers, and capitalization issues are easily repaired by feeding back the specific validation failure.
  * **Retrying missing data fails:** If the data is absent from the input, retrying will force the model to hallucinate. You must check for data absence first and fail/abort early.
  * Always provide the original source text, the bad response, and the specific field-level validation message in the retry turn.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Comfort with JSON formatting. Read the <strong>Prompt Engineering — Advanced Patterns</strong> lesson first, specifically the sections on validation-retry loops.
</div>

**Why this matters:** The exam heavily tests when a validation-retry loop is appropriate and when it is an anti-pattern. If a system retries after discovering that a required field is missing from the source document, it triggers fabrication. Knowing to isolate structural errors (retryable) from data absence (escalate/abort) is a key competency of a Claude Architect.
