import { z } from "zod";

export const clarificationFieldSchema = z.object({
    key: z.string(),
    label: z.string(),
    type: z.enum(["text", "select"]),
    options: z.array(z.string()).optional(),
});

export type ClarificationField = z.infer<
    typeof clarificationFieldSchema
>;

export const researchAnalysisSchema = z.object({
    researchQuestion: z.string(),
    instrument: z.string().nullable(),
    timeframe: z.string().nullable(),
    entryCondition: z.string().nullable(),
    exitCondition: z.string().nullable(),
    holdingPeriod: z.string().nullable(),
    testPeriod: z.string().nullable(),
    transactionCosts: z.string().nullable(),
    filters: z.array(z.string()),
    hypothesis: z.string(),
    missingInformation: z.array(clarificationFieldSchema),
    status: z.enum(["needs_clarification", "ready"]),
});

export type ResearchAnalysis = z.infer<
    typeof researchAnalysisSchema
>;

export const experimentSchema = z.object({
    researchQuestion: z.string(),
    instrument: z.string(),
    timeframe: z.string(),
    entryCondition: z.string(),
    exitCondition: z.string(),
    holdingPeriod: z.string(),
    testPeriod: z.string(),
    transactionCosts: z.string(),
    filters: z.array(z.string()),
    hypothesis: z.string(),
});

export type Experiment = z.infer<typeof experimentSchema>;