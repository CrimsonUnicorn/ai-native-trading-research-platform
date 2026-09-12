import { NextResponse } from "next/server";

import { gemini } from "@/lib/gemini";
import { researchAnalysisSchema } from "@/lib/schemas";

const ANALYSIS_PROMPT = `
You are an AI trading research assistant.

Analyze the user's research question and extract the information needed
to turn it into a testable trading experiment.

Return ONLY valid JSON.

The JSON must have exactly these fields:

{
  "researchQuestion": "string",
  "instrument": "string or null",
  "timeframe": "string or null",
  "entryCondition": "string or null",
  "exitCondition": "string or null",
  "holdingPeriod": "string or null",
  "testPeriod": "string or null",
  "transactionCosts": "string or null",
  "filters": ["string"],
  "hypothesis": "string",
  "missingInformation": [
  {
    "key": "string",
    "label": "string",
    "type": "text or select",
    "options": ["string"]
  }
],
  "status": "needs_clarification or ready"
}

Rules:
- Do not invent important trading parameters.
- If an important parameter is missing, use null.
- Add every missing important parameter to "missingInformation".
- Each missing information item must contain:
  - key: a short machine-readable field name
  - label: a human-readable question
  - type: "select" when reasonable predefined choices exist, otherwise "text"
  - options: provide 2-5 reasonable choices for select fields
- Do not invent a user's answer.
- Options are suggestions for the user to choose from, not assumptions.
- Set status to "needs_clarification" when important information is missing.
- Set status to "ready" only when enough information exists to define a meaningful experiment.
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const question = body.question;

        if (typeof question !== "string" || !question.trim()) {
            return NextResponse.json(
                {
                    error: "Research question is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const input = `${ANALYSIS_PROMPT}

User research question:
"${question.trim()}"`;

        const interaction = await gemini.interactions.create({
            model: "gemini-3.6-flash",
            input,
            generation_config: {
                thinking_level: "low",
            },
        });

        const text = interaction.output_text;

        if (!text) {
            return NextResponse.json(
                {
                    error: "Gemini returned an empty response.",
                },
                {
                    status: 502,
                },
            );
        }

        const cleanedText = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let parsed: unknown;

        try {
            parsed = JSON.parse(cleanedText);
        } catch {
            console.error("Gemini returned invalid JSON:", text);

            return NextResponse.json(
                {
                    error: "Gemini returned invalid JSON.",
                },
                {
                    status: 502,
                },
            );
        }

        const validated = researchAnalysisSchema.safeParse(parsed);

        if (!validated.success) {
            console.error(
                "Invalid Gemini response:",
                validated.error,
            );

            return NextResponse.json(
                {
                    error: "Gemini returned an invalid research analysis.",
                },
                {
                    status: 502,
                },
            );
        }

        return NextResponse.json(validated.data);
    } catch (error) {
        console.error("Analysis error:", error);

        return NextResponse.json(
            {
                error: "Failed to analyze the research question.",
                details:
                    error instanceof Error ? error.message : String(error),
            },
            {
                status: 500,
            },
        );
    }
}