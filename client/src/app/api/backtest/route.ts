import { NextResponse } from "next/server";
import { z } from "zod";
import { mockMarketData } from "@/lib/mock-data";
import { runBacktest } from "@/lib/backtest";
import { experimentSchema } from "@/lib/schemas";

const backtestRequestSchema = z.object({
  experiment: experimentSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { experiment } = backtestRequestSchema.parse(body);

    const result = runBacktest(mockMarketData, experiment);

    return NextResponse.json({
      success: true,
      dataSource: "Simulated market data",
      result,
    });
  } catch (error) {
    console.error("Backtest error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid experiment definition.",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to run experiment.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}