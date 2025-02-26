import axios from 'axios';
import { EarningsData } from '../types';

// This is a mock API service that simulates fetching earnings data
// In a real application, you would connect to a financial data API

export const fetchEarningsData = async (symbol: string, year: number): Promise<{ earnings: EarningsData[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, you would make an API call like:
  // return axios.get(`/api/earnings/${symbol}/${year}`);
  
  // For demo purposes, we'll generate mock data
  return {
    earnings: generateMockEarningsData(symbol, year)
  };
};

// Generate realistic mock data for demonstration purposes
function generateMockEarningsData(symbol: string, year: number): EarningsData[] {
  const result: EarningsData[] = [];
  
  // Generate quarterly reports (Q1, Q2, Q3, Q4)
  const quarters = [
    { month: 3, day: 15 },  // Q1: around mid-March
    { month: 6, day: 15 },  // Q2: around mid-June
    { month: 9, day: 15 },  // Q3: around mid-September
    { month: 12, day: 5 },  // Q4: early December
  ];
  
  // Add some randomness to the dates
  quarters.forEach((quarter, index) => {
    const randomDayOffset = Math.floor(Math.random() * 10) - 5; // -5 to +5 days
    const day = Math.max(1, Math.min(28, quarter.day + randomDayOffset));
    
    const reportDate = new Date(year, quarter.month - 1, day);
    
    // Skip future dates
    if (reportDate > new Date()) return;
    
    // Generate realistic stock prices (base price between €30 and €200)
    const basePrice = 30 + (symbol.charCodeAt(0) % 5) * 40; // Different base price per company
    const volatility = 0.02 + (Math.random() * 0.03); // 2-5% volatility
    
    const previousClose = basePrice * (1 + (Math.random() * 0.4) - 0.2 + (index * 0.05)); // Slight uptrend through the year
    
    // Earnings reaction (more volatile)
    const earningsReaction = (Math.random() > 0.5) 
      ? 1 + (Math.random() * volatility * 3) // positive surprise
      : 1 - (Math.random() * volatility * 3); // negative surprise
    
    const dayClose = previousClose * earningsReaction;
    
    // Day range
    const dayHigh = Math.max(previousClose, dayClose) * (1 + (Math.random() * 0.02));
    const dayLow = Math.min(previousClose, dayClose) * (1 - (Math.random() * 0.02));
    
    // Determine sentiment based on price change
    let sentiment: 'Positive' | 'Negative' | 'Neutral';
    const priceChangePercent = ((dayClose - previousClose) / previousClose) * 100;
    
    if (priceChangePercent > 1.5) {
      sentiment = 'Positive';
    } else if (priceChangePercent < -1.5) {
      sentiment = 'Negative';
    } else {
      sentiment = 'Neutral';
    }
    
    result.push({
      reportDate: reportDate.toISOString(),
      reportType: index === 3 ? 'Annual' : 'Quarterly',
      previousClose: parseFloat(previousClose.toFixed(2)),
      dayClose: parseFloat(dayClose.toFixed(2)),
      dayHigh: parseFloat(dayHigh.toFixed(2)),
      dayLow: parseFloat(dayLow.toFixed(2)),
      sentiment: sentiment
    });
  });
  
  return result;
}