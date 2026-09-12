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

function getTradingDay(timestamp: string): string {
  return timestamp.split("T")[0];
}

export function runBacktest(
  data: MarketDataPoint[],
  experiment: Experiment,
): BacktestResult {
  const holdingPeriod =
    extractNumber(experiment.holdingPeriod) ?? 1;

  const fallThresholdPercent =
    extractNumber(experiment.entryCondition) ?? 1;

  const trades: BacktestTrade[] = [];

  let currentTradingDay = "";
  let rollingDailyHigh = 0;

  for (
    let i = 0;
    i < data.length - holdingPeriod;
    i++
  ) {
    const currentBar = data[i];
    const tradingDay = getTradingDay(currentBar.timestamp);

    if (tradingDay !== currentTradingDay) {
      currentTradingDay = tradingDay;
      rollingDailyHigh = currentBar.high;
    } else {
      rollingDailyHigh = Math.max(
        rollingDailyHigh,
        currentBar.high,
      );
    }

    const entryPriceThreshold =
      rollingDailyHigh *
      (1 - fallThresholdPercent / 100);

    const isFall =
      currentBar.close <= entryPriceThreshold;

    if (!isFall) {
      continue;
    }

    const entry = data[i];
    const exit = data[i + holdingPeriod];

    const returnPercent =
      ((exit.close - entry.close) / entry.close) * 100;

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