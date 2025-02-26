import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BarChart3, TrendingUp, Calendar, Search } from 'lucide-react';
import CompanySelector from './components/CompanySelector';
import YearSelector from './components/YearSelector';
import EarningsAnalysis from './components/EarningsAnalysis';
import { DAX40_COMPANIES } from './data/companies';

const queryClient = new QueryClient();

function App() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (selectedCompany && selectedYear) {
      setIsAnalyzing(true);
    }
  };

  const resetAnalysis = () => {
    setIsAnalyzing(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">DAX 40 Earnings Analyzer</h1>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Financial Analysis Tool</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {!isAnalyzing ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Select Company and Financial Year</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    DAX 40 Company
                  </label>
                  <CompanySelector 
                    companies={DAX40_COMPANIES} 
                    selectedCompany={selectedCompany} 
                    onSelectCompany={setSelectedCompany} 
                  />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Financial Year
                  </label>
                  <YearSelector 
                    selectedYear={selectedYear} 
                    onSelectYear={setSelectedYear} 
                    minYear={2000} 
                    maxYear={new Date().getFullYear()} 
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedCompany || !selectedYear}
                    className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${!selectedCompany || !selectedYear 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Earnings Reports
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EarningsAnalysis 
              company={DAX40_COMPANIES.find(c => c.symbol === selectedCompany)!} 
              year={selectedYear} 
              onBack={resetAnalysis} 
            />
          )}
        </main>

        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DAX 40 Earnings Analyzer. All data is for informational purposes only.
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;