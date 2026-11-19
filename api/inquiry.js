const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map();

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Use POST to submit an inquiry.' }); }
  const now = Date.now();
  const ip = (req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const bucket = buckets.get(ip) || { count: 0, start: now };
  if (now - bucket.start > WINDOW_MS) { bucket.count = 0; bucket.start = now; }
  if (++bucket.count > MAX_REQUESTS) return res.status(429).json({ message: 'Please wait before trying again.' });
  buckets.set(ip, bucket);
  let data = req.body;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch { data = null; } }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ message: 'Please check your inquiry and try again.' });
  if (typeof data.website === 'string' && data.website.trim()) return res.status(200).json({ ok: true });
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const question = typeof data.question === 'string' ? data.question.trim() : '';
  const marketingConsent = data.marketingConsent === true;
  if (!name || name.length > 80 || !/^[\p{L}\p{N} .,'’()_\-+!?\n\r:;@#&/]+$/u.test(name) || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !question || question.length > 1200) return res.status(400).json({ message: 'Please check the name, email and question fields.' });
  const webhook = process.env.PABBLY_WEBHOOK_URL;
  if (!webhook) return res.status(503).json({ message: 'The inquiry service is not configured yet.' });
  try {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, question, marketingConsent, source: 'ENT4113 landing page' }), signal: controller.signal });
    clearTimeout(timeout);
    if (!upstream.ok) return res.status(502).json({ message: 'The inquiry could not be delivered. Please try again later.' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ message: 'The inquiry could not be delivered. Please try again later.' }); }
};
