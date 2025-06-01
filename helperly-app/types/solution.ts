import { z } from 'zod';

export const solutionSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    kind: z.literal('simpleSolution'),
    location: z.string(),
    mode: z.literal('createFromNew'),
    status: z.enum(['draft', 'published']),
    defaultSectionName: z.string(),
    defaultSubSectionName: z.string(),
    defaultEventId: z.string().uuid(),
    defaultEventName: z.string(),
    problem: z.string(),
    title: z.string(),
    solutionDetails: z.object({
        title: z.string(),
        description: z.string(),
        rootCause: z.string(),
        countermeasure: z.string(),
    }),
    email: z.string().email(),
});

export type SolutionSchema = z.infer<typeof solutionSchema>;

export const createSolutionSchema = z.object({
    name: z.string(),
    description: z.string(),
    location: z.string(),
    defaultSectionName: z.string().optional(),
    defaultSubSectionName: z.string().optional(),
    defaultEventId: z.string().uuid().optional(),
    defaultEventName: z.string().optional(),
    problem: z.string(),
    title: z.string(),
    solutionDetails: z.object({
        title: z.string(),
        description: z.string(),
        rootCause: z.string(),
        countermeasure: z.string(),
    }),
    email: z.string().email(),
});

export type CreateSolutionSchema = z.infer<typeof createSolutionSchema>;
