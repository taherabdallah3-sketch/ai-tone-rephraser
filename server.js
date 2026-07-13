import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_CHARS = 4000;
const TONES = [
  'professional', 'casual', 'friendly', 'formal', 'confident',
  'empathetic', 'assertive', 'concise', 'enthusiastic', 'diplomatic'
];

app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/rephrase', async (req, res) => {
  const { text, tone } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (text.length > MAX_CHARS) {
    return res.status(400).json({ error: `text must be under ${MAX_CHARS} characters` });
  }
  if (typeof tone !== 'string' || !TONES.includes(tone)) {
    return res.status(400).json({ error: `tone must be one of: ${TONES.join(', ')}` });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: 'You rewrite text in a requested tone. Preserve the original meaning and language. ' +
        'Return only the rewritten text, with no preamble, quotes, or explanation.',
      messages: [
        { role: 'user', content: `Rewrite the following text in a ${tone} tone:\n\n${text}` }
      ]
    });

    const result = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    res.json({ result });
  } catch (err) {
    console.error('Rephrase failed:', err.message);
    res.status(502).json({ error: 'Failed to rephrase text. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI Tone Rephraser running on http://localhost:${PORT}`));
