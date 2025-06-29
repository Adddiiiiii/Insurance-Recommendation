import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto text-center">
          <h1 className=" md:text-6xl font-bold mb-4">InsureTech</h1>
          <h3 className="md:text-2xl font-bold mb-4">Insurance Product Recommendation GenAI Agent</h3>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Your AI-powered insurance advisor for personalized financial planning</p>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 flex-grow">
        {/* Problem Statement */}
        <section className="problem-statement">
          <h2 className="text-2xl font-semibold mb-4">🔍 Problem Statement</h2>
          <p className="text-gray-600">
            Navigating the complex world of insurance products can be overwhelming. Most people struggle to 
            understand which insurance plans best suit their unique financial situation, goals, and risk profile. 
            Our GenAI Agent bridges this gap by providing tailored recommendations based on your personal profile.
          </p>
        </section>
        
        {/* Features Section */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">✨ Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              icon="🎯" 
              title="Personalized Recommendations" 
              description="Get insurance product suggestions tailored to your specific financial profile and goals"
            />
            
            <FeatureCard 
              icon="📋" 
              title="Tax Benefit Analysis" 
              description="Understand the tax advantages associated with recommended insurance products"
            />
            
            <FeatureCard 
              icon="💰" 
              title="Premium Estimates" 
              description="Receive instant estimates of potential premium costs based on your income"
            />
            
            <FeatureCard 
              icon="🤖" 
              title="AI-Powered Insights" 
              description="Get human-like explanations that break down complex insurance concepts"
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="text-2xl font-semibold mb-4">Ready to find your perfect insurance match?</h2>
          <p className="text-lg text-gray-600 mb-8">Get personalized recommendations in just a few clicks</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/recommendation')}
          >
            Start Now
          </button>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage; 