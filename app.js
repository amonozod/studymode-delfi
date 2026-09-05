const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Delfi, a friendly AI tutor for StudyMode, helping students prepare for IELTS and SAT. Answer questions about IELTS (Reading, Listening, Writing, Speaking) and SAT (Reading, Writing, Math) clearly and accurately. Keep answers concise since students are studying under time pressure.`;

app.post('/api/delfi', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });
    const data = await response.json();
    const reply = data.content[0].text;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Delfi error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delfi running on port ${PORT}`));
