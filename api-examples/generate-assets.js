// Example Vercel/Node serverless function for real AI generation.
// This is not wired into the browser MVP yet. Use it when converting to production.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY missing' });

  const { business, job } = req.body || {};
  if (!business?.name || !job?.serviceType) return res.status(400).json({ error: 'Missing business or job details' });

  const prompt = `You are JobProof, a marketing assistant for small local home-service businesses.

Create practical marketing assets from completed-job notes. The business owner is busy and not a marketer.

Rules:
- Be specific, but never invent facts.
- Do not claim before/after outcomes unless the notes mention them.
- Do not say "5-star review".
- Do not offer incentives for reviews.
- Do not filter unhappy customers.
- Ask for honest feedback only.
- Optimize project pages for local search with service + city.
- Return valid JSON only.

Business: ${JSON.stringify(business)}
Completed job: ${JSON.stringify(job)}

Return JSON with these keys: seoTitle, projectHeading, shortSummary, pageBody, googlePost, socialCaption, reviewSms, reviewEmailSubject, reviewEmail, testimonialPrompt, hashtags, altText, quoteMessage.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return res.status(500).json({ error: 'AI generation failed', detail: text });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  return res.status(200).json(JSON.parse(content));
}
