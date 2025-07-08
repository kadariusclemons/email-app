// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-emails', async (req, res) => {
  const { userInput, recipientName } = req.body;

  const messages = [
    {
      role: 'system',
      content: 'You are an expert marketing assistant who writes short, professional email campaigns.'
    },
    {
      role: 'user',
      content: `Write 3 marketing emails for a campaign about: "${userInput}". Personalize it for someone named ${recipientName || 'there'}. Include subject lines, body text, and call-to-actions.`
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json({ output: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate emails.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));