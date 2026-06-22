import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const domainId = z.enum(['agentic', 'prompting', 'workflows', 'mcp', 'context']);
const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    domain: domainId,
    order: z.number().default(0),
    minutes: z.number().default(5),
    summary: z.string(),
  }),
});

const exercises = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exercises' }),
  schema: z.object({
    title: z.string(),
    domain: domainId,
    difficulty,
    estMinutes: z.number().default(10),
    order: z.number().default(0),
    intro: z.string(),
    steps: z.array(z.string()).default([]),
    hints: z.array(z.string()).default([]),
    // Optional self-check commands the learner can run in their own terminal.
    verify: z
      .array(z.object({ label: z.string(), command: z.string() }))
      .default([]),
    // Model solution shown only when the learner clicks "Reveal".
    solution: z.string(),
  }),
});

const quiz = defineCollection({
  loader: file('./src/content/quiz/questions.json'),
  schema: z.object({
    id: z.string(),
    domain: domainId,
    difficulty,
    question: z.string(),
    options: z.array(z.string()).min(2),
    answer: z.number(), // 0-based index into options
    explanation: z.string(),
  }),
});

export const collections = { lessons, exercises, quiz };
