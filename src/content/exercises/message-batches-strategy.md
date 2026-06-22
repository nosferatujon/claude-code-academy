---
title: Choose the right workload for Message Batches
domain: prompting
difficulty: intermediate
estMinutes: 20
order: 4
intro: Understand when to use the Message Batches API — 50% cost savings and high throughput with a 24-hour window — and practice correlating results with custom_id.
steps:
  - "Consider two workflows: (A) a pre-merge CI check that blocks a pull request and must complete in under 2 minutes, and (B) an overnight analysis that classifies 10,000 support tickets before the morning standup."
  - "Decide which workflow is appropriate for the Message Batches API. Write down your reasoning before checking the solution."
  - "Write a small batch request in Python (or via curl) that sends 5 invoice-classification messages, each with a unique `custom_id` like `invoice-001` through `invoice-005`."
  - "Submit the batch and retrieve the `batch_id`."
  - "Poll (or wait) for the batch to complete, then fetch the results."
  - "Map each result back to its original message using `custom_id`. Confirm that results arrive in a different order than submitted — batches do NOT guarantee ordering."
  - "Calculate the effective per-message cost: batch pricing is 50% of standard API pricing. For 10,000 messages at $3/MTok input, what is the saving?"
hints:
  - "The Message Batches API has a processing window of up to 24 hours. Use it only when latency doesn't matter."
  - "`custom_id` is your correlation key — always set it to something meaningful so you can match results to inputs after the batch completes."
  - "Batch results arrive out of order. Never assume result[0] corresponds to request[0]."
  - "The 50% cost reduction applies to both input and output tokens."
  - "Good batch candidates: overnight enrichment, bulk classification, generating embeddings, audit log analysis, any fire-and-forget workload."
  - "Bad batch candidates: anything user-facing, anything that blocks another process, real-time checks."
verify:
  - label: "Confirms the batch script exists."
    command: "ls batch-classify.*"
solution: |
  **Workflow A (pre-merge CI check) is NOT appropriate for batches.** It blocks a pull request and must complete in under 2 minutes. The Message Batches API processes requests within 24 hours — it would make the CI gate unusable.

  **Workflow B (overnight ticket classification) IS the ideal batch workload.** It is latency-insensitive, high-volume, and runs on a schedule. The 50% cost savings are significant at 10,000 messages.

  Cost math for workflow B:

  ```
  Standard: 10,000 × average 500 tokens input × $3/MTok = $15.00
  Batch:     same × 50% = $7.50
  Saving:    $7.50 per nightly run
  ```

  `batch-classify.py`:

  ```python
  import anthropic
  import json
  import time

  client = anthropic.Anthropic()

  # Build 5 classification requests with meaningful custom_ids
  requests = [
      {
          "custom_id": f"invoice-{str(i).zfill(3)}",
          "params": {
              "model": "claude-haiku-4-5",
              "max_tokens": 64,
              "messages": [{
                  "role": "user",
                  "content": f"Classify this support ticket as 'billing', 'bug', 'feature', or 'other'. Reply with only the label.\n\nTicket {i}: {ticket}"
              }]
          }
      }
      for i, ticket in enumerate([
          "I was charged twice this month.",
          "The export button does nothing since the last update.",
          "Can you add dark mode to the dashboard?",
          "Thanks, everything is working great!",
          "My invoice shows the wrong company name."
      ], start=1)
  ]

  # Submit the batch
  batch = client.beta.messages.batches.create(requests=requests)
  print(f"Batch submitted: {batch.id}")
  print(f"Status: {batch.processing_status}")

  # Poll until complete (in practice, use a webhook or check the next morning)
  while batch.processing_status == "in_progress":
      time.sleep(30)
      batch = client.beta.messages.batches.retrieve(batch.id)
      print(f"Still processing... ({batch.request_counts})")

  # Fetch and correlate results by custom_id
  results = {}
  for result in client.beta.messages.batches.results(batch.id):
      if result.result.type == "succeeded":
          label = result.result.message.content[0].text.strip()
          results[result.custom_id] = label
      else:
          results[result.custom_id] = f"ERROR: {result.result.type}"

  # Print in submission order using custom_id
  for i in range(1, 6):
      key = f"invoice-{str(i).zfill(3)}"
      print(f"{key}: {results.get(key, 'missing')}")
  ```

  Decision guide:

  | Criterion | Use Batches | Use Standard API |
  |-----------|------------|-----------------|
  | Latency requirement | None / overnight | Real-time / seconds |
  | Volume | 100s–millions | Any |
  | Blocks another process | No | Yes |
  | User is waiting | No | Yes |
  | Cost sensitivity | High (50% savings) | Lower priority |
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  An Anthropic API key (this exercise uses the Claude API directly, not just the Claude Code CLI). Familiarity with reading API documentation. Read the <strong>Prompt Engineering — Advanced Patterns</strong> lesson first.
</div>

**Why this matters:** The Message Batches API is a significant cost lever, but only for the right workloads. The exam tests whether you can correctly identify batch-appropriate scenarios (latency-insensitive, high-volume), explain the trade-off (50% savings vs 24-hour window), and implement `custom_id` correlation for out-of-order results. Getting the scenario wrong — using batches for a blocking CI check — is a common distractor.
