'use client';

import { useState, useEffect } from 'react';

interface Expenses {
  managementFee: number;
  cleaningTax: string;
  maintenance: string;
  insurance: string;
  utilities: string;
  repairs: string;
}

interface Props {
  entityType: 'person' | 'company';
}

export default function TaxCalculator({ entityType }: Props) {
  const [rentalIncome, setRentalIncome] = useState('');
  const [expenses, setExpenses] = useState<Expenses>({
    managementFee: 0,
    cleaningTax: '',
    maintenance: '',
    insurance: '',
    utilities: '',
    repairs: ''
  });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netOperatingIncome, setNetOperatingIncome] = useState(0);
  const [moneyYouMake, setMoneyYouMake] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [paysVAT, setPaysVAT] = useState<boolean | null>(null);

  // Calculate management fee whenever rental income changes
  useEffect(() => {
    const income = parseFloat(rentalIncome.replace(/,/g, '')) || 0;
    const managementFeeAmount = income * 0.20;
    
    setExpenses(prev => ({
      ...prev,
      managementFee: managementFeeAmount
    }));
  }, [rentalIncome]);

  const calculateTax = (amount: number) => {
    if (entityType === 'company') {
      if (paysVAT === null) return 0;
      return paysVAT 
        ? amount * 0.19 // 19% on revenue
        : amount * 0.16; // 16% on profit
    }

    // Personal tax calculation (existing progressive tax)
    let tax = 0;
    let taxable = amount;

    if (taxable > 578125) {
      tax += (taxable - 578125) * 0.37;
      taxable = 578125;
    }
    if (taxable > 231250) {
      tax += (taxable - 231250) * 0.35;
      taxable = 231250;
    }
    if (taxable > 182100) {
      tax += (taxable - 182100) * 0.32;
      taxable = 182100;
    }
    if (taxable > 95375) {
      tax += (taxable - 95375) * 0.24;
      taxable = 95375;
    }
    if (taxable > 44725) {
      tax += (taxable - 44725) * 0.22;
      taxable = 44725;
    }
    if (taxable > 11000) {
      tax += (taxable - 11000) * 0.12;
      taxable = 11000;
    }
    tax += taxable * 0.10;

    return tax;
  };

  const handleExpenseChange = (field: keyof Expenses, value: string) => {
    setExpenses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotals = () => {
    const income = parseFloat(rentalIncome.replace(/,/g, '')) || 0;
    
    // Calculate other expenses
    const otherExpenses = Object.entries(expenses).reduce((sum, [key, value]) => {
      if (key !== 'managementFee') {
        if (key === 'insurance' && !includeInsurance) return sum;
        const amount = parseFloat(value.toString().replace(/,/g, '')) || 0;
        return sum + amount;
      }
      return sum;
    }, 0);

    const totalExp = expenses.managementFee + otherExpenses;
    const netIncome = income - totalExp;

    setTotalExpenses(totalExp);
    setMoneyYouMake(netIncome);
    setNetOperatingIncome(netIncome);
    setTotalTax(calculateTax(entityType === 'company' && paysVAT ? income : netIncome));
    setShowDetails(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entityType === 'company' && paysVAT === null) return;
    calculateTotals();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderExpenseInput = (label: string, field: keyof Expenses, isReadOnly = false, isOptional = false) => (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {isOptional && (
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={(e) => setIncludeInsurance(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-xs text-gray-500">Optional</span>
            </label>
          </div>
        )}
      </div>
      <div className="mt-1 relative rounded-md shadow-sm">
        {isReadOnly ? (
          <div className="text-gray-900 font-bold py-1">
            {formatCurrency(Number(expenses[field]))}
          </div>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name={field}
              id={field}
              value={expenses[field]}
              onChange={(e) => handleExpenseChange(field, e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md font-bold text-black"
              placeholder="0.00"
              disabled={field === 'insurance' && !includeInsurance}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company VAT Selection */}
          {entityType === 'company' && (
            <div className="bg-blue-50 p-6 rounded-xl shadow-inner mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Do you pay VAT?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setPaysVAT(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                    paysVAT === true
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Yes (19% on Revenue)
                </button>
                <button
                  type="button"
                  onClick={() => setPaysVAT(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                    paysVAT === false
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  No (16% on Profit)
                </button>
              </div>
            </div>
          )}

          {/* Annual Rental Income */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner">
            <label htmlFor="rentalIncome" className="block text-xl font-bold text-gray-900 mb-3">
              Annual Rental Income
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">$</span>
              </div>
              <input
                type="text"
                name="rentalIncome"
                id="rentalIncome"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 text-xl border-gray-300 rounded-md font-bold text-black h-14"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Money You Make Display */}
          {moneyYouMake !== 0 && (
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You make</h2>
                  <div className="text-4xl sm:text-5xl font-bold text-green-600">
                    {formatCurrency(moneyYouMake)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">per year</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-6 py-3 text-sm font-bold text-blue-600 hover:text-blue-700 focus:outline-none hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {showDetails ? 'Hide details' : 'See more'}
                </button>
              </div>

              {showDetails && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600 font-medium">Total Operating Expenses:</span>
                      <span className="font-bold text-red-600 text-lg">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600 font-medium">
                        {entityType === 'company' ? (paysVAT ? 'VAT (19% on Revenue)' : 'Tax (16% on Profit)') : 'Estimated Tax:'}
                      </span>
                      <span className="font-bold text-blue-600 text-lg">{formatCurrency(totalTax)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600 font-medium">After-Tax Income:</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(netOperatingIncome - totalTax)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Operating Expenses */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Operating Expenses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderExpenseInput('Management Fee (20%)', 'managementFee', true)}
              {renderExpenseInput('Cleaning', 'cleaningTax')}
              {renderExpenseInput('Maintenance', 'maintenance')}
              {renderExpenseInput('Insurance', 'insurance', false, true)}
              {renderExpenseInput('Utilities', 'utilities')}
              {renderExpenseInput('Repairs', 'repairs')}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] text-base font-bold shadow-lg"
            >
              Calculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

