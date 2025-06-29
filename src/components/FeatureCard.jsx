import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="text-5xl mb-4 bg-primary-light text-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-md">
        {icon}
      </div>
      <h3>{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard; 