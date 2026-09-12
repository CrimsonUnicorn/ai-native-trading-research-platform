import { NextResponse } from "next/server";
import { z } from "zod";
import { mockMarketData } from "@/lib/mock-data";
import { runBacktest } from "@/lib/backtest";

const backtestRequestSchema = z.object({
  holdingDays: z.number().int().positive().default(3),
  fallThresholdPercent: z.number().positive().default(1),
  volatilityThreshold: z.number().positive().default(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const config = backtestRequestSchema.parse(body);

    const result = runBacktest(mockMarketData, config);

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
          error: "Invalid backtest configuration.",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to run backtest.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}