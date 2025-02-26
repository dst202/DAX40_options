import React from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Minus, ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';
import { EarningsData } from '../types';

interface EarningsTableProps {
  earnings: EarningsData[];
}

const EarningsTable: React.FC<EarningsTableProps> = ({ earnings }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Report Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Report Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sentiment
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Previous Close
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day Close
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day High
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day Low
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price Change
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              High Change %
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Low Change %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {earnings.map((item, index) => {
            const priceChange = item.dayClose - item.previousClose;
            const priceChangePercent = (priceChange / item.previousClose) * 100;
            const highChangePercent = ((item.dayHigh - item.previousClose) / item.previousClose) * 100;
            const lowChangePercent = ((item.dayLow - item.previousClose) / item.previousClose) * 100;
            
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(item.reportDate), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.reportType === 'Annual' 
                      ? 'bg-purple-100 text-purple-800' 
                      : item.reportType === 'Quarterly' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {item.reportType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className={`flex items-center ${
                    item.sentiment === 'Positive' 
                      ? 'text-green-600' 
                      : item.sentiment === 'Negative' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                  }`}>
                    {item.sentiment === 'Positive' ? (
                      <ThumbsUp className="h-4 w-4 mr-1" />
                    ) : item.sentiment === 'Negative' ? (
                      <ThumbsDown className="h-4 w-4 mr-1" />
                    ) : (
                      <MinusCircle className="h-4 w-4 mr-1" />
                    )}
                    <span>{item.sentiment}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{item.previousClose.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{item.dayClose.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{item.dayHigh.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{item.dayLow.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${
                    priceChange > 0 
                      ? 'text-green-600' 
                      : priceChange < 0 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                  }`}>
                    {priceChange > 0 ? (
                      <ArrowUpCircle className="h-4 w-4 mr-1" />
                    ) : priceChange < 0 ? (
                      <ArrowDownCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Minus className="h-4 w-4 mr-1" />
                    )}
                    <span>{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${highChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                    <span>{highChangePercent.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${lowChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{lowChangePercent.toFixed(2)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EarningsTable;