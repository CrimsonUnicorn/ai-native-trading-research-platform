import { MarketDataPoint } from "./mock-data";

export interface BacktestTrade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  returnPercent: number;
  volatility: "high" | "normal";
}

export interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageReturn: number;
  totalReturn: number;
  highVolatilityTrades: number;
  normalVolatilityTrades: number;
  highVolatilityAverageReturn: number;
  normalVolatilityAverageReturn: number;
  trades: BacktestTrade[];
}

interface BacktestConfig {
  holdingDays: number;
  fallThresholdPercent: number;
  volatilityThreshold: number;
}

export function runBacktest(
  data: MarketDataPoint[],
  config: BacktestConfig,
): BacktestResult {
  const trades: BacktestTrade[] = [];

  for (let i = 1; i < data.length - config.holdingDays; i++) {
    const previousDay = data[i - 1];
    const currentDay = data[i];

    const dailyChange =
      ((currentDay.close - previousDay.close) / previousDay.close) * 100;

    const isFall =
      dailyChange <= -config.fallThresholdPercent;

    if (!isFall) {
      continue;
    }

    const entryIndex = i;
    const exitIndex = i + config.holdingDays;

    const entry = data[entryIndex];
    const exit = data[exitIndex];

    const returnPercent =
      ((exit.close - entry.close) / entry.close) * 100;

    trades.push({
      entryDate: entry.date,
      exitDate: exit.date,
      entryPrice: entry.close,
      exitPrice: exit.close,
      returnPercent,
      volatility:
        entry.indiaVix > config.volatilityThreshold
          ? "high"
          : "normal",
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
    trades.length > 0 ? totalReturn / trades.length : 0;

  const highVolatilityTrades = trades.filter(
    (trade) => trade.volatility === "high",
  );

  const normalVolatilityTrades = trades.filter(
    (trade) => trade.volatility === "normal",
  );

  const highVolatilityAverageReturn =
    highVolatilityTrades.length > 0
      ? highVolatilityTrades.reduce(
          (sum, trade) => sum + trade.returnPercent,
          0,
        ) / highVolatilityTrades.length
      : 0;

  const normalVolatilityAverageReturn =
    normalVolatilityTrades.length > 0
      ? normalVolatilityTrades.reduce(
          (sum, trade) => sum + trade.returnPercent,
          0,
        ) / normalVolatilityTrades.length
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
    highVolatilityTrades: highVolatilityTrades.length,
    normalVolatilityTrades: normalVolatilityTrades.length,
    highVolatilityAverageReturn,
    normalVolatilityAverageReturn,
    trades,
  };
}