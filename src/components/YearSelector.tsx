import React from 'react';

interface YearSelectorProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  minYear: number;
  maxYear: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  selectedYear, 
  onSelectYear, 
  minYear, 
  maxYear 
}) => {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  return (
    <div className="relative">
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => onSelectYear(parseInt(e.target.value, 10))}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;