import { z } from "zod";

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

    missingInformation: z.array(z.string()),

    status: z.enum(["needs_clarification", "ready"]),
});

export type ResearchAnalysis = z.infer<
    typeof researchAnalysisSchema
>;