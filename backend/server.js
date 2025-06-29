const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Check for API key in different places
let API_KEY = process.env.TOGETHER_API_KEY || process.env.API_KEY;

// Try to get API key from command line arguments
if (!API_KEY) {
    const apiKeyArg = process.argv.find(arg => arg.startsWith('--api-key='));
    if (apiKeyArg) {
        API_KEY = apiKeyArg.split('=')[1];
    }
}

// Log the API key
if (API_KEY) {
    const maskedKey = API_KEY.substring(0, 4) + '...' + API_KEY.substring(API_KEY.length - 4);
    console.log(`API key loaded: ${maskedKey}`);
} else {
    console.error('WARNING: API key is not set. Please provide it via .env file or command line argument --api-key=YOUR_KEY');
}

const MODELS = [
    'google/gemma-3-27b-it',
    'meta-llama/Meta-Llama-3-8B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.2',
    'google/gemma-2-9b-it'
];

app.post('/api/generate-recommendation', async (req, res) => {
    const { prompt } = req.body;
    console.log('Received recommendation request with prompt:', prompt.substring(0, 100) + '...');

    try {
        
        if (!API_KEY) {
            throw new Error('API key is not configured');
        }

        // Try different models in order until one works
        let lastError = null;
        let response = null;
        
        for (const model of MODELS) {
            try {
                console.log(`Making API request to Together.ai with model: ${model}...`);
                
                response = await axios.post('https://api.together.xyz/v1/chat/completions', 
                {
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content:"You are an experienced, friendly, and conversational insurance advisor. Your job is to understand the user's profile and recommend the most suitable insurance products based only on their age, income, financial goals, and risk appetite. Do NOT act like a financial planner. Avoid suggesting investments, wealth building, or tax-saving unless it’s part of an insurance plan.Respond like a human advisor speaking in natural, helpful language. Do not write in formal letter format. Avoid using greetings like 'Hello', 'Dear', or 'Respected'. Do NOT close your message with 'Best regards', 'Thanks', or 'Have a nice day'.Focus entirely on giving clear, helpful, and friendly recommendations — no fluff, no formality."
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000 
                });
                
                console.log(`API request successful with model: ${model}`);
                break; 
            } catch (modelError) {
                console.error(`Error with model ${model}:`, modelError.message);
                lastError = modelError;
                // Continue to the next model
            }
        }
        
        if (response) {
            const reply = response.data.choices[0].message.content;
            res.json({ reply });
        } else {
            throw lastError || new Error('All models failed');
        }

    } catch (error) {
        console.error('Error generating recommendation:', error.message);
        if (error.response) {
            console.error('API response error:', error.response.data);
        }

        // Provide a fallback response
        const fallbackResponse = `
I'm sorry, but I couldn't generate an AI-powered recommendation at this moment due to technical difficulties.

Based on the information you've provided, here are some general insurance recommendations:

1. For your age group and income level, consider products that balance protection and investment.
2. Given your financial goals, look for products that specifically address those needs.
3. Your risk appetite suggests you might prefer products with moderate risk-return profiles.

Please try again later for a more personalized AI recommendation, or contact our support team for assistance.
        `;
        
        res.json({ 
            reply: fallbackResponse,
            error: true,
            message: 'Using fallback response due to API unavailability'
        });
    }
});

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running properly' });
});

// Add an endpoint to check API key
app.get('/api/check-config', (req, res) => {
    const hasApiKey = !!API_KEY;
    res.json({ 
        hasApiKey,
        message: hasApiKey ? 'API key is configured' : 'API key is missing'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});