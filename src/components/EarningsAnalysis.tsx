import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Download, RefreshCw } from 'lucide-react';
import { Company } from '../types';
import { fetchEarningsData } from '../services/api';
import EarningsTable from './EarningsTable';
import PriceChart from './PriceChart';
import LoadingSpinner from './LoadingSpinner';

interface EarningsAnalysisProps {
  company: Company;
  year: number;
  onBack: () => void;
}

const EarningsAnalysis: React.FC<EarningsAnalysisProps> = ({ company, year, onBack }) => {
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
  
  const { data, isLoading, isError, refetch } = useQuery(
    ['earningsData', company.symbol, year],
    () => fetchEarningsData(company.symbol, year),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  const handleExportCSV = () => {
    if (!data || data.earnings.length === 0) return;
    
    const headers = [
      'Report Date', 
      'Report Type', 
      'Sentiment',
      'Previous Close', 
      'Day Close', 
      'Day High', 
      'Day Low', 
      'Price Change %', 
      'High Change %', 
      'Low Change %'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.earnings.map(item => {
        const priceChangePercent = ((item.dayClose - item.previousClose) / item.previousClose * 100).toFixed(2);
        const highChangePercent = ((item.dayHigh - item.previousClose) / item.previousClose * 100).toFixed(2);
        const lowChangePercent = ((item.dayLow - item.previousClose) / item.previousClose * 100).toFixed(2);
        
        return [
          format(new Date(item.reportDate), 'yyyy-MM-dd'),
          item.reportType,
          item.sentiment || 'Neutral',
          item.previousClose.toFixed(2),
          item.dayClose.toFixed(2),
          item.dayHigh.toFixed(2),
          item.dayLow.toFixed(2),
          priceChangePercent,
          highChangePercent,
          lowChangePercent
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${company.symbol}_${year}_earnings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{company.name} ({company.symbol})</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Financial Year {year}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={isLoading || isError || !data || data.earnings.length === 0}
            className={`p-2 text-sm rounded-md flex items-center ${
              isLoading || isError || !data || data.earnings.length === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('table')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'table'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Earnings Table
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'chart'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Price Chart
          </button>
        </nav>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load earnings data</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        ) : data && data.earnings.length > 0 ? (
          activeTab === 'table' ? (
            <EarningsTable earnings={data.earnings} />
          ) : (
            <PriceChart earnings={data.earnings} companyName={company.name} />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No earnings data available for {company.name} in {year}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsAnalysis;