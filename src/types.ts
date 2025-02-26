export interface Company {
  name: string;
  symbol: string;
}

export interface EarningsData {
  reportDate: string;
  reportType: 'Annual' | 'Quarterly' | 'Semi-Annual';
  previousClose: number;
  dayClose: number;
  dayHigh: number;
  dayLow: number;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
}