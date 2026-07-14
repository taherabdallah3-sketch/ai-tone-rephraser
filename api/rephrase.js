import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_CHARS = 4000;
const TONES = [
  'professional', 'casual', 'friendly', 'formal', 'confident',
  'empathetic', 'assertive', 'concise', 'enthusiastic', 'diplomatic'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ result });
  } catch (err) {
    console.error('Rephrase failed:', err.message);
    res.status(502).json({ error: 'Failed to rephrase text. Please try again.' });
  }
}
