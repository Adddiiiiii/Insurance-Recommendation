import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RecommendationPage from './pages/RecommendationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 