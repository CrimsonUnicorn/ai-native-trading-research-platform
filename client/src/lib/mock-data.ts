export interface MarketDataPoint {
  date: string;
  close: number;
  indiaVix: number;
}

export const mockMarketData: MarketDataPoint[] = [
  { date: "2023-01-02", close: 18100, indiaVix: 15 },
  { date: "2023-01-03", close: 18050, indiaVix: 16 },

  // High volatility entry
  { date: "2023-01-04", close: 17850, indiaVix: 22 },
  { date: "2023-01-05", close: 17950, indiaVix: 21 },
  { date: "2023-01-06", close: 18100, indiaVix: 19 },
  { date: "2023-01-09", close: 18250, indiaVix: 18 },

  // Normal volatility entry
  { date: "2023-01-10", close: 17950, indiaVix: 18 },
  { date: "2023-01-11", close: 18050, indiaVix: 17 },
  { date: "2023-01-12", close: 18100, indiaVix: 16 },
  { date: "2023-01-13", close: 18200, indiaVix: 15 },

  // High volatility entry
  { date: "2023-01-16", close: 17800, indiaVix: 27 },
  { date: "2023-01-17", close: 17900, indiaVix: 26 },
  { date: "2023-01-18", close: 18100, indiaVix: 24 },
  { date: "2023-01-19", close: 18300, indiaVix: 21 },

  // Normal volatility entry
  { date: "2023-01-20", close: 18000, indiaVix: 18 },
  { date: "2023-01-23", close: 18100, indiaVix: 17 },
  { date: "2023-01-24", close: 18150, indiaVix: 16 },
  { date: "2023-01-25", close: 18200, indiaVix: 15 },

  // High volatility entry
  { date: "2023-01-27", close: 17900, indiaVix: 23 },
  { date: "2023-01-30", close: 18000, indiaVix: 22 },
  { date: "2023-01-31", close: 18200, indiaVix: 21 },
  { date: "2023-02-01", close: 18400, indiaVix: 19 },

  // Normal volatility entry
  { date: "2023-02-02", close: 18100, indiaVix: 17 },
  { date: "2023-02-03", close: 18150, indiaVix: 16 },
  { date: "2023-02-06", close: 18200, indiaVix: 15 },
  { date: "2023-02-07", close: 18300, indiaVix: 14 },
];