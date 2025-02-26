import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { EarningsData } from '../types';
import { ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  earnings: EarningsData[];
  companyName: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ earnings, companyName }) => {
  const [chartType, setChartType] = useState<'priceChange' | 'highLow' | 'sentiment'>('priceChange');
  
  const sortedEarnings = [...earnings].sort(
    (a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
  );

  const labels = sortedEarnings.map(item => 
    format(new Date(item.reportDate), 'MMM d, yyyy')
  );

  const priceChangeData = {
    labels,
    datasets: [
      {
        label: 'Price Change %',
        data: sortedEarnings.map(item => 
          ((item.dayClose - item.previousClose) / item.previousClose) * 100
        ),
        backgroundColor: sortedEarnings.map(item => 
          item.dayClose >= item.previousClose 
            ? 'rgba(75, 192, 192, 0.7)' 
            : 'rgba(255, 99, 132, 0.7)'
        ),
        borderColor: sortedEarnings.map(item => 
          item.dayClose >= item.previousClose 
            ? 'rgb(75, 192, 192)' 
            : 'rgb(255, 99, 132)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const highLowData = {
    labels,
    datasets: [
      {
        label: 'Day High Change %',
        data: sortedEarnings.map(item => 
          ((item.dayHigh - item.previousClose) / item.previousClose) * 100
        ),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Day Low Change %',
        data: sortedEarnings.map(item => 
          ((item.dayLow - item.previousClose) / item.previousClose) * 100
        ),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  };

  const sentimentData = {
    labels,
    datasets: [
      {
        label: 'Earnings Sentiment',
        data: sortedEarnings.map(item => {
          if (item.sentiment === 'Positive') return 1;
          if (item.sentiment === 'Negative') return -1;
          return 0;
        }),
        backgroundColor: sortedEarnings.map(item => {
          if (item.sentiment === 'Positive') return 'rgba(75, 192, 192, 0.7)';
          if (item.sentiment === 'Negative') return 'rgba(255, 99, 132, 0.7)';
          return 'rgba(201, 203, 207, 0.7)';
        }),
        borderColor: sortedEarnings.map(item => {
          if (item.sentiment === 'Positive') return 'rgb(75, 192, 192)';
          if (item.sentiment === 'Negative') return 'rgb(255, 99, 132)';
          return 'rgb(201, 203, 207)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'priceChange' 
          ? `${companyName} Price Change % on Earnings Dates`
          : chartType === 'highLow'
            ? `${companyName} High/Low Change % on Earnings Dates`
            : `${companyName} Earnings Report Sentiment`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (chartType === 'sentiment') {
              const value = context.raw;
              if (value === 1) return 'Positive';
              if (value === -1) return 'Negative';
              return 'Neutral';
            }
            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: chartType === 'sentiment' ? 'Sentiment' : 'Change (%)',
        },
        ticks: chartType === 'sentiment' ? {
          callback: function(value: any) {
            if (value === 1) return 'Positive';
            if (value === 0) return 'Neutral';
            if (value === -1) return 'Negative';
            return '';
          }
        } : undefined
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setChartType('priceChange')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            chartType === 'priceChange'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Price Change
        </button>
        <button
          onClick={() => setChartType('highLow')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            chartType === 'highLow'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          High/Low Change
        </button>
        <button
          onClick={() => setChartType('sentiment')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            chartType === 'sentiment'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sentiment
        </button>
      </div>
      
      <div>
        <Bar 
          data={
            chartType === 'priceChange' 
              ? priceChangeData 
              : chartType === 'highLow'
                ? highLowData
                : sentimentData
          } 
          options={options} 
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Chart Information</h3>
        <p className="text-xs text-gray-600">
          {chartType === 'priceChange' 
            ? 'This chart shows the percentage change between the previous day close and the earnings day close price.'
            : chartType === 'highLow'
              ? 'This chart compares the percentage change between the previous day close and the day high/low prices on earnings dates.'
              : 'This chart displays the sentiment of each earnings report based on market reaction.'}
        </p>
      </div>

      {chartType === 'sentiment' && (
        <div className="flex justify-center space-x-8 mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <div className="flex items-center text-sm">
              <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />
              <span>Positive</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <div className="flex items-center text-sm">
              <MinusCircle className="h-4 w-4 mr-1 text-gray-500" />
              <span>Neutral</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <div className="flex items-center text-sm">
              <ThumbsDown className="h-4 w-4 mr-1 text-red-600" />
              <span>Negative</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;