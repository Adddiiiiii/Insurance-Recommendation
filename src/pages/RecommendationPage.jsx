import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ProductExpander from '../components/ProductExpander';
import { loadInsuranceProducts } from '../utils/csvDataLoader';
import { recommendProducts, generateResponse, generateAIRecommendation } from '../utils/recommendationUtils';

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(500000);
  const [financialGoal, setFinancialGoal] = useState('Tax Saving');
  const [riskAppetite, setRiskAppetite] = useState('Medium');
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [insuranceProducts, setInsuranceProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useAI, setUseAI] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [riskDropdownOpen, setRiskDropdownOpen] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  
  // Define the new financial goals
  const financialGoals = [
    "Tax Saving",
    "Wealth Creation",
    "Life Cover",
    "Health Security",
    "Emergency Fund",
    "Retirement Planning",
    "Child Education",
    "Estate Planning"
  ];

  // Risk appetite options with descriptions
  const riskOptions = [
    { value: "Low", label: "Low", description: "Conservative approach with stable returns" },
    { value: "Medium", label: "Medium", description: "Balanced risk-return profile" },
    { value: "High", label: "High", description: "Growth-focused with higher volatility" }
  ];

  // Load insurance products from CSV when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await loadInsuranceProducts();
        setInsuranceProducts(products);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load insurance products:', err);
        setError('Failed to load insurance products. Please try again later.');
        setLoading(false);
      }
    };

    // Check if AI API is available
    const checkAiAvailability = async () => {
      try {
        const response = await fetch('/api/check-config');
        if (response.ok) {
          const data = await response.json();
          setAiAvailable(data.hasApiKey);
          if (!data.hasApiKey) {
            console.warn('AI API key not configured. AI recommendations will be unavailable.');
          }
        } else {
          setAiAvailable(false);
        }
      } catch (err) {
        console.error('Failed to check AI availability:', err);
        setAiAvailable(false);
      }
    };

    fetchProducts();
    checkAiAvailability();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (insuranceProducts.length === 0) {
      setError('No insurance products available. Please try again later.');
      return;
    }
    
    const userProfile = {
      age,
      income,
      financialGoal,
      riskAppetite
    };
    
    const recommendations = recommendProducts(insuranceProducts, userProfile);
    
    if (useAI && aiAvailable) {
      setAiLoading(true);
      try {
        const aiResponse = await generateAIRecommendation(userProfile, recommendations);
        setRecommendationResult({
          products: recommendations,
          response: aiResponse
        });
      } catch (error) {
        console.error('Error generating AI recommendation:', error);
        // Fall back to standard response
        const standardResponse = generateResponse(userProfile, recommendations);
        setRecommendationResult({
          products: recommendations,
          response: standardResponse,
          aiError: true
        });
      } finally {
        setAiLoading(false);
      }
    } else {
      const standardResponse = generateResponse(userProfile, recommendations);
      setRecommendationResult({
        products: recommendations,
        response: standardResponse,
        usingStandardResponse: !useAI
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insurance products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-blue-50 to-indigo-50" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-indigo-800">Insurance Product Recommendation</h1>
          <p className="text-xl text-gray-600">Fill in your details below to get personalized insurance recommendations</p>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 flex-grow py-8">
        {/* Form Container */}
        <div className="form-container bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-indigo-700 border-b pb-2">Your Profile</h2>
                
                <div className="mb-8">
                  <label className="block text-gray-700 mb-2 font-medium">Age: <span className="text-indigo-600 font-bold">{age}</span></label>
                  <div className="relative pt-1">
                    <input 
                      type="range" 
                      min="18" 
                      max="100" 
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>18</span>
                      <span className="bg-indigo-100 px-2 py-1 rounded-full text-indigo-800 font-medium transform -translate-y-1 transition-all duration-300">
                        {age} years
                      </span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-gray-700 mb-2 font-medium">Annual Income: <span className="text-indigo-600 font-bold">₹{(income / 100000).toFixed(1)}L</span></label>
                  <div className="relative pt-1">
                    <input 
                      type="range" 
                      min="100000" 
                      max="5000000" 
                      step="50000"
                      value={income}
                      onChange={(e) => setIncome(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>₹1L</span>
                      <span className="bg-indigo-100 px-2 py-1 rounded-full text-indigo-800 font-medium transform -translate-y-1 transition-all duration-300">
                        ₹{(income / 100000).toFixed(1)}L
                      </span>
                      <span>₹50L</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-6 text-indigo-700 border-b pb-2">Your Preferences</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Primary Financial Goal</label>
                  <div className="relative">
                    <div 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer bg-white flex justify-between items-center transition-all duration-300 hover:bg-indigo-50"
                    >
                      <span>{financialGoal}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${dropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    
                    {dropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-300 animate-fadeIn">
                        {financialGoals.map((goal, index) => (
                          <div 
                            key={index} 
                            className={`p-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-200 ${goal === financialGoal ? 'bg-indigo-100 font-medium' : ''}`}
                            onClick={() => {
                              setFinancialGoal(goal);
                              setDropdownOpen(false);
                            }}
                          >
                            {goal}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Risk Appetite</label>
                  <div className="relative">
                    <div 
                      onClick={() => setRiskDropdownOpen(!riskDropdownOpen)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer bg-white flex justify-between items-center transition-all duration-300 hover:bg-indigo-50"
                    >
                      <span>{riskAppetite}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${riskDropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    
                    {riskDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-300 animate-fadeIn">
                        {riskOptions.map((option, index) => (
                          <div 
                            key={index} 
                            className={`p-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-200 ${option.value === riskAppetite ? 'bg-indigo-100 font-medium' : ''}`}
                            onClick={() => {
                              setRiskAppetite(option.value);
                              setRiskDropdownOpen(false);
                            }}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button 
                type="submit" 
                className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transform transition-all duration-300 
                  ${aiLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-xl'}`}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating Recommendations...
                  </div>
                ) : 'Get Recommendations'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {recommendationResult && (
          <div className="result-card bg-white rounded-xl shadow-lg p-6 mt-8 max-w-4xl mx-auto transition-all duration-500 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-center pb-4 border-b border-gray-200 text-indigo-700">
              Your {useAI && aiAvailable && !recommendationResult.aiError ? 'AI-Powered' : 'Personalized'} Recommendation
            </h2>
            <div className="whitespace-pre-line text-gray-700 mb-8">
              {recommendationResult.response}
            </div>
            
            {recommendationResult.products.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">Recommended Products</h3>
                {recommendationResult.products.map((product, index) => (
                  <ProductExpander key={index} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Back Button */}
        <div className="text-center my-8">
          <button 
            className="px-6 py-2 rounded-lg font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecommendationPage; 