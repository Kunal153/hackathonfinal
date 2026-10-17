import { solveProblem } from '../_lib/geminiService';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { problemText, category = 'General' } = body;

    if (!problemText || typeof problemText !== 'string' || !problemText.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or problem.' });
    }

    const result = await solveProblem(problemText, category);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/solve:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while solving the problem.',
      details: error?.message || String(error),
    });
  }
}
