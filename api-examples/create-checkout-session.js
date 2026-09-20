// Example Stripe Checkout endpoint for production.
// Requires: npm install stripe

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceByPlan = {
  beta: process.env.JOBPROOF_BETA_SETUP_PRICE_ID,
  starter: process.env.JOBPROOF_STARTER_PRICE_ID,
  pro: process.env.JOBPROOF_PRO_PRICE_ID,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { plan = 'starter', customerEmail } = req.body || {};
  const price = priceByPlan[plan];
  if (!price) return res.status(400).json({ error: 'Unknown plan' });

  const session = await stripe.checkout.sessions.create({
    mode: plan === 'beta' ? 'payment' : 'subscription',
    customer_email: customerEmail,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.VITE_APP_URL}/#dashboard?checkout=success`,
    cancel_url: `${process.env.VITE_APP_URL}/#pricing?checkout=cancelled`,
    allow_promotion_codes: true,
  });

  res.status(200).json({ url: session.url });
}
