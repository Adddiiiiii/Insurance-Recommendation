import React, { useState } from 'react';

const ProductExpander = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mb-4">
      <div 
        className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${product.partialMatch ? 'border-amber-400' : 'border-primary'} transition-all duration-300 ${isExpanded ? 'mb-0' : ''}`}
      >
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h3 className={`font-semibold ${product.partialMatch ? 'text-amber-600' : 'text-primary'} m-0`}>
              {product.name}
            </h3>
            {product.partialMatch && (
              <span className="text-xs text-amber-600 mt-1 block">
                Partial match - {product.matchedOnGoal ? 'Matches your financial goal' : ''} 
                {product.matchedOnGoal && product.matchedOnRisk ? ' and ' : ''}
                {product.matchedOnRisk ? 'Matches your risk appetite' : ''}
              </span>
            )}
          </div>
          <span className="text-xl">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
        
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <p className="mb-3"><strong>Description:</strong> {product.description}</p>
            <p className="mb-3"><strong>Monthly Premium:</strong> ₹{product.monthlyPremium.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="mb-3"><strong>Annual Premium:</strong> ₹{product.annualPremium.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="mb-3"><strong>Tax Benefit:</strong> {product.taxBenefit}</p>
            {product.partialMatch && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  <strong>Note:</strong> This product is recommended based on a partial match to your criteria, 
                  but still aligns well with your overall profile.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExpander; 