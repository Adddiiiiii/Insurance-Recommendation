/**
 * Recommend insurance products based on user profile
 * 
 * @param {Array} insuranceProducts - Array of insurance products
 * @param {Object} userProfile - User profile data
 * @returns {Array} - Array of recommended products with details
 */
export const recommendProducts = (insuranceProducts, userProfile) => {
  const { age, income, financialGoal, riskAppetite } = userProfile;
  const recommendedProducts = [];
  
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
  
  // First pass: Find exact matches for all criteria
  for (const product of insuranceProducts) {
    // Check if product matches user criteria
    const ageMatch = product.minAge <= age && age <= product.maxAge;
    const incomeMatch = income >= product.minIncome;
    
    // Clean up suitableFor and risk fields if they're strings with array notation
    let suitableFor = product.suitableFor;
    if (typeof suitableFor === 'string') {
      // Remove array notation and split by comma
      suitableFor = suitableFor.replace(/[\[\]']/g, '').split(',').map(item => item.trim());
    }
    
    let risk = product.risk;
    if (typeof risk === 'string') {
      // Remove array notation and split by comma
      risk = risk.replace(/[\[\]']/g, '').split(',').map(item => item.trim());
    }
    
    // Check if the financial goal matches
    const goalMatch = Array.isArray(suitableFor) && suitableFor.some(goal => goal === financialGoal);
    
    // Check if the risk appetite matches
    const riskMatch = Array.isArray(risk) && risk.some(r => r === riskAppetite);
    
    if (ageMatch && incomeMatch && goalMatch && riskMatch) {
      // Calculate estimated premium
      const monthlyPremium = Math.round((income * product.premiumFactor) / 12 * 100) / 100;
      
      recommendedProducts.push({
        name: product.name,
        description: product.description,
        monthlyPremium,
        annualPremium: monthlyPremium * 12,
        taxBenefit: product.taxBenefit
      });
    }
  }
  
  // If no exact matches, try more flexible matching
  if (recommendedProducts.length === 0) {
    for (const product of insuranceProducts) {
      // Check if product matches essential criteria (age and income)
      const ageMatch = product.minAge <= age && age <= product.maxAge;
      const incomeMatch = income >= product.minIncome;
      
      // Clean up suitableFor and risk fields if they're strings with array notation
      let suitableFor = product.suitableFor;
      if (typeof suitableFor === 'string') {
        // Remove array notation and split by comma
        suitableFor = suitableFor.replace(/[\[\]']/g, '').split(',').map(item => item.trim());
      }
      
      let risk = product.risk;
      if (typeof risk === 'string') {
        // Remove array notation and split by comma
        risk = risk.replace(/[\[\]']/g, '').split(',').map(item => item.trim());
      }
      
      // Either goal or risk should match
      const goalMatch = Array.isArray(suitableFor) && suitableFor.some(goal => goal === financialGoal);
      const riskMatch = Array.isArray(risk) && risk.some(r => r === riskAppetite);
      
      if (ageMatch && incomeMatch && (goalMatch || riskMatch)) {
        // Calculate estimated premium
        const monthlyPremium = Math.round((income * product.premiumFactor) / 12 * 100) / 100;
        
        recommendedProducts.push({
          name: product.name,
          description: product.description,
          monthlyPremium,
          annualPremium: monthlyPremium * 12,
          taxBenefit: product.taxBenefit,
          // Flag to indicate this is a partial match
          partialMatch: true,
          matchedOnGoal: goalMatch,
          matchedOnRisk: riskMatch
        });
      }
    }
  }
  
  return recommendedProducts;
};

/**
 * Generate personalized response based on user profile and recommendations
 * 
 * @param {Object} userProfile - User profile data
 * @param {Array} recommendedProducts - Array of recommended products
 * @returns {String} - Personalized response
 */
export const generateResponse = (userProfile, recommendedProducts) => {
  const { age, income, financialGoal, riskAppetite } = userProfile;
  
  if (recommendedProducts.length === 0) {
    return "Based on your profile, we couldn't find suitable insurance products. Please consider adjusting your preferences or consult with our financial advisors for personalized recommendations.";
  }
  
  let productNames = recommendedProducts.map(p => p.name);
  let productNamesText = '';
  
  if (productNames.length === 1) {
    productNamesText = productNames[0];
  } else {
    productNamesText = productNames.slice(0, -1).join(', ') + ' and ' + productNames[productNames.length - 1];
  }
  
  const riskDescriptions = {
    "Low": "conservative approach to financial planning",
    "Medium": "balanced approach to risk and returns",
    "High": "growth-oriented investment strategy"
  };
  
  const goalDescriptions = {
    "Tax Saving": "optimize your tax liabilities",
    "Wealth Creation": "build wealth over the long term",
    "Life Cover": "provide financial security for your loved ones",
    "Health Security": "secure your health and well-being",
    "Emergency Fund": "prepare for unexpected financial needs",
    "Retirement Planning": "ensure a comfortable retirement",
    "Child Education": "secure your child's educational future",
    "Estate Planning": "effectively transfer wealth to the next generation"
  };
  
  // Add a note about partial matches if applicable
  let partialMatchNote = "";
  if (recommendedProducts.some(p => p.partialMatch)) {
    partialMatchNote = "\n\nSome recommendations are based on partial matches to your criteria, but still align well with your overall profile.";
  }
  
  return `
    As a ${age}-year-old with a ${riskAppetite.toLowerCase()} risk appetite (a ${riskDescriptions[riskAppetite] || "personalized investment strategy"}) 
    and a primary goal of ${financialGoal} (looking to ${goalDescriptions[financialGoal] || "meet your specific financial objectives"}), 
    we recommend ${productNamesText}.
    
    These products align well with your financial profile and can help you achieve your objectives 
    while staying within your risk comfort zone. The estimated premiums are based on your annual income 
    of ₹${income.toLocaleString()}.${partialMatchNote}
    
    We suggest scheduling a consultation with a financial advisor to customize these recommendations 
    further based on your specific needs and circumstances.
  `;
};

/**
 * Generate AI-powered recommendations using the Gemma model API
 * 
 * @param {Object} userProfile - User profile data
 * @param {Array} recommendedProducts - Array of recommended products
 * @returns {Promise<String>} - AI-generated recommendation response
 */
export const generateAIRecommendation = async (userProfile, recommendedProducts) => {
  const { age, income, financialGoal, riskAppetite } = userProfile;
  
  try {
    // Create a detailed prompt for the AI model
    let prompt = `
User Profile:
- Age: ${age} years
- Annual Income: ₹${income.toLocaleString()}
- Financial Goal: ${financialGoal}
- Risk Appetite: ${riskAppetite}

Recommended Insurance Products:
`;

    if (recommendedProducts.length === 0) {
      prompt += "No products matched the user's criteria.";
    } else {
      recommendedProducts.forEach((product, index) => {
        prompt += `
${index + 1}. ${product.name}
   Description: ${product.description}
   Monthly Premium: ₹${product.monthlyPremium.toLocaleString()}
   Annual Premium: ₹${product.annualPremium.toLocaleString()}
   Tax Benefit: ${product.taxBenefit ? 'Yes' : 'No'}
   ${product.partialMatch ? '(Partial match)' : '(Exact match)'}
`;
      });
    }

    prompt += `
Based on the user's profile and the recommended insurance products, provide a detailed, personalized recommendation. 
Explain why these products are suitable for the user's age, income level, financial goals, and risk appetite. 
If there are partial matches, explain why they might still be good options. 
Include advice on how the user might optimize their insurance coverage based on their specific situation.
`;

    console.log('Sending request to AI recommendation API...');
    
    // Call the backend API
    const response = await fetch('/api/generate-recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API response not OK:', errorData);
      throw new Error(errorData.error || 'Failed to generate AI recommendation');
    }

    const data = await response.json();
    
    // Check if we got a fallback response due to API issues
    if (data.error) {
      console.warn('Received fallback response:', data.message);
      return `${data.reply}\n\n[Note: This is a fallback recommendation as our AI service is temporarily unavailable.]`;
    }
    
    return data.reply;
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    
    // Check if the error is related to API key configuration
    if (error.message && error.message.includes('API key')) {
      const apiKeyMessage = `
AI-powered recommendations are currently unavailable due to API configuration issues.

Here's a standard recommendation based on your profile:
-----------------------------------------------------`;
      
      // Fall back to the standard response if AI generation fails
      const standardResponse = generateResponse(userProfile, recommendedProducts);
      return `${apiKeyMessage}\n\n${standardResponse}`;
    } else {
      // Generic error
      const standardResponse = generateResponse(userProfile, recommendedProducts);
      return `${standardResponse}\n\n[Note: We're experiencing technical difficulties with our AI recommendation system. This is a standard recommendation.]`;
    }
  }
}; 