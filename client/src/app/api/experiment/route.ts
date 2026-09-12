import { NextResponse } from "next/server";

import { gemini } from "@/lib/gemini";
import { experimentSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { question, answers, analysis } = body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      !answers ||
      !analysis
    ) {
      return NextResponse.json(
        {
          error: "Question, answers, and analysis are required.",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are an AI trading research assistant.

Create a precise, testable trading research experiment.

Original research question:
"${question}"

Initial analysis:
${JSON.stringify(analysis, null, 2)}

User's clarification answers:
${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON.

The JSON must contain exactly:

{
  "researchQuestion": "string",
  "instrument": "string",
  "timeframe": "string",
  "entryCondition": "string",
  "exitCondition": "string",
  "holdingPeriod": "string",
  "testPeriod": "string",
  "transactionCosts": "string",
  "filters": ["string"],
  "hypothesis": "string"
}

Rules:
- Use the user's clarification answers.
- Do not invent important parameters that the user did not provide.
- Make every trading rule precise enough to test.
- Clearly define entry and exit conditions.
- Clearly define the holding period.
- Clearly define the historical test period.
- Include transaction costs or state that they are zero only if explicitly specified.
- The hypothesis should be testable.
`;

    const interaction = await gemini.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
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
      console.error("Invalid experiment JSON:", text);

      return NextResponse.json(
        {
          error: "Gemini returned invalid experiment JSON.",
        },
        {
          status: 502,
        },
      );
    }

    const validated = experimentSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(
        "Invalid experiment:",
        validated.error,
      );

      return NextResponse.json(
        {
          error: "Gemini returned an invalid experiment.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(validated.data);
  } catch (error) {
    console.error("Experiment error:", error);

    return NextResponse.json(
      {
        error: "Failed to build experiment.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    );
  }
}