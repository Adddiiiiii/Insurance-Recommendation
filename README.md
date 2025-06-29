# Insurance Product Recommendation GenAI Agent

This application helps users find suitable insurance products based on their age, income, financial goals, and risk appetite. It uses a combination of rule-based filtering and AI-powered recommendations via the Gemma 3 27B IT model from Together.ai.

## Features

- User-friendly interface to input personal details and preferences
- Rule-based filtering of insurance products
- AI-powered personalized recommendations using Gemma 3 model
- Detailed product information and comparisons
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI Model**: Gemma 3 27B IT via Together.ai API
- **Data**: CSV-based product database

## Project Structure

```
Insurance Recommendation Agent/
├── backend/                   # Backend server code
│   ├── server.js              # Express server with Gemma API integration
│   └── .env                   # Environment variables (API keys)
├── public/                    # Static assets
│   └── data/                  # Insurance product data (CSV)
└── src/                       # Frontend React code
    ├── components/            # Reusable UI components
    ├── pages/                 # Application pages
    └── utils/                 # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Together.ai API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd insurance-recommendation-agent
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   TOGETHER_API_KEY=your_together_api_key_here
   PORT=3001
   ```

### Running the Application

1. Start both frontend and backend concurrently:
   ```
   npm run dev
   ```

2. Or run them separately:
   - Frontend: `npm start` (runs on port 3000)
   - Backend: `cd backend && npm run dev` (runs on port 3001)

3. Access the application at `http://localhost:3000`

## Using the Application

1. Navigate to the recommendation page
2. Enter your age, income, financial goals, and risk appetite
3. Choose whether to use AI-powered recommendations
4. Click "Get Recommendations" to receive personalized insurance product suggestions
5. Review the detailed AI-generated advice and product information

## License

[MIT License](LICENSE) 