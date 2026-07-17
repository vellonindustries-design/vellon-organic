import crypto from 'node:crypto';
import { saveOrder } from '../lib/orders.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  try {
    const { payment, items, shipping } = request.body || {};
    const valid = payment?.razorpay_order_id && payment?.razorpay_payment_id && payment?.razorpay_signature;
    if (!valid || !Array.isArray(items) || !shipping?.name) return response.status(400).json({ error: 'Invalid order details.' });
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${payment.razorpay_order_id}|${payment.razorpay_payment_id}`).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(payment.razorpay_signature))) return response.status(400).json({ error: 'Payment could not be verified.' });
    const id = `VO-${Date.now().toString(36).toUpperCase()}-${payment.razorpay_payment_id.slice(-4).toUpperCase()}`;
    const order = { id, status: 'paid', paymentId: payment.razorpay_payment_id, razorpayOrderId: payment.razorpay_order_id, items, shipping, createdAt: new Date().toISOString() };
    await saveOrder(order);
    return response.status(200).json({ orderId: id });
  } catch { return response.status(500).json({ error: 'We could not record this order. Please contact us with your payment ID.' }); }
}

