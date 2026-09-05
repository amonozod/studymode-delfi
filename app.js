const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/delfi', (req, res) => {
  const { messages } = req.body;
  const body = JSON.stringify({
    model: 'llama-3.1-8b-instant',
    max_tokens: 600,
    messages: [
      { role: 'system', content: 'You are Delfi, a friendly AI tutor for StudyMode, helping students prepare for IELTS and SAT. Answer questions clearly and concisely.' },
      ...messages
    ]
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.json({ reply: parsed.choices[0].message.content });
      } catch(e) {
        res.status(500).json({ error: 'Parse error' });
      }
    });
  });

  apiReq.on('error', (e) => res.status(500).json({ error: e.message }));
  apiReq.write(body);
  apiReq.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Delfi running on port ' + PORT));
