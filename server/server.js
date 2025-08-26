const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message, apiKey } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (apiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant. Provide clear, concise, and helpful responses.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiResponse = response.data.choices[0].message.content;
        return res.json({ response: aiResponse });
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError.response?.data || openaiError.message);
      }
    }

    const stubResponses = [
      `I understand you said: "${message}". This is a demo response since no valid API key was provided.`,
      `Echo: ${message}`,
      `Thanks for your message: "${message}". I'm currently running in demo mode.`,
      `Demo response to: "${message}". To get real AI responses, please add your OpenAI API key in settings.`,
      `I received your message: "${message}". This is a placeholder response.`
    ];

    const randomResponse = stubResponses[Math.floor(Math.random() * stubResponses.length)];
    
    setTimeout(() => {
      res.json({ response: randomResponse });
    }, 1000);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ChatGPT Clone Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Chat endpoint: POST http://localhost:${PORT}/chat`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
});
