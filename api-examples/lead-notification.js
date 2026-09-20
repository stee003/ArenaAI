// Example lead notification endpoint using Resend.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY missing' });

  const { businessEmail, businessName, lead, proofUrl } = req.body || {};
  if (!businessEmail || !lead) return res.status(400).json({ error: 'Missing lead or recipient' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.LEAD_NOTIFICATION_FROM || 'JobProof <leads@example.com>',
      to: businessEmail,
      subject: `New JobProof lead for ${businessName || 'your business'}`,
      text: `New lead from JobProof\n\nName: ${lead.name || ''}\nPhone: ${lead.phone || ''}\nEmail: ${lead.email || ''}\nMessage: ${lead.message || ''}\nProof page: ${proofUrl || ''}`,
    }),
  });

  if (!response.ok) return res.status(500).json({ error: await response.text() });
  res.status(200).json({ ok: true });
}
