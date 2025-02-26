import React from 'react';
import { Company } from '../types';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string;
  onSelectCompany: (symbol: string) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  companies, 
  selectedCompany, 
  onSelectCompany 
}) => {
  return (
    <div className="relative">
      <select
        id="company"
        value={selectedCompany}
        onChange={(e) => onSelectCompany(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
      >
        <option value="">Select a company</option>
        {companies.map((company) => (
          <option key={company.symbol} value={company.symbol}>
            {company.name} ({company.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;