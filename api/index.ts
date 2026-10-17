import { solveProblem, summarizePdf } from './_lib/geminiService';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
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

  const url = req.url || '';

  // Route: /api/health or /api
  if (url === '/api' || url === '/api/' || url === '/api/health' || url === '/' || url === '') {
    return res.status(200).json({
      status: 'ok',
      service: 'EngiNotes API Engine',
      endpoints: [
        'POST /api/gemini/solve',
        'POST /api/gemini/summarize-pdf',
        'POST /api/gemini/last-minute-notes',
      ],
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  }

  // Handle /api/gemini/solve fallback
  if (url.includes('/gemini/solve')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { problemText, category = 'General' } = body;
    if (!problemText || typeof problemText !== 'string' || !problemText.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or problem.' });
    }
    const result = await solveProblem(problemText, category);
    return res.status(200).json(result);
  }

  // Handle /api/gemini/summarize-pdf or last-minute-notes fallback
  if (url.includes('/gemini/summarize-pdf') || url.includes('/gemini/last-minute-notes')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const result = await summarizePdf(body);
    return res.status(200).json(result);
  }

  return res.status(404).json({ error: `Not found: ${url}` });
}
