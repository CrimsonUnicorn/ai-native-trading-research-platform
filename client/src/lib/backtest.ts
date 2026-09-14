import { MarketDataPoint } from "./mock-data";
import { Experiment } from "./schemas";

export interface BacktestTrade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  returnPercent: number;
}

export interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageReturn: number;
  totalReturn: number;
  trades: BacktestTrade[];
}

function extractNumber(value: string): number | null {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function runBacktest(
  data: MarketDataPoint[],
  experiment: Experiment,
): BacktestResult {
  const holdingPeriod =
    extractNumber(experiment.holdingPeriod) ?? 3;

  const fallThresholdPercent =
    extractNumber(experiment.entryCondition) ?? 1;

  const trades: BacktestTrade[] = [];

  for (
    let i = 1;
    i < data.length - holdingPeriod;
    i++
  ) {
    const previousBar = data[i - 1];
    const currentBar = data[i];

    // Calculate percentage change from previous bar
    const priceChangePercent =
      ((currentBar.close - previousBar.close) /
        previousBar.close) *
      100;

    // Entry when price falls by the requested percentage
    const isFall =
      priceChangePercent <= -fallThresholdPercent;

    if (!isFall) {
      continue;
    }

    const entry = currentBar;
    const exit = data[i + holdingPeriod];

    const returnPercent =
      ((exit.close - entry.close) /
        entry.close) *
      100;

    trades.push({
      entryDate: entry.timestamp,
      exitDate: exit.timestamp,
      entryPrice: entry.close,
      exitPrice: exit.close,
      returnPercent,
    });
  }

  const winningTrades = trades.filter(
    (trade) => trade.returnPercent > 0,
  ).length;

  const losingTrades = trades.filter(
    (trade) => trade.returnPercent <= 0,
  ).length;

  const totalReturn = trades.reduce(
    (sum, trade) => sum + trade.returnPercent,
    0,
  );

  const averageReturn =
    trades.length > 0
      ? totalReturn / trades.length
      : 0;

  return {
    totalTrades: trades.length,
    winningTrades,
    losingTrades,
    winRate:
      trades.length > 0
        ? (winningTrades / trades.length) * 100
        : 0,
    averageReturn,
    totalReturn,
    trades,
  };
}