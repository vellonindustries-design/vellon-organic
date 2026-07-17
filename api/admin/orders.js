import { getOrder, listOrders, updateOrder } from '../../lib/orders.js';
import { sendOrderConfirmedSms } from '../../lib/sms.js';

function authorised(request) { return process.env.ADMIN_DASHBOARD_KEY && request.headers['x-admin-key'] === process.env.ADMIN_DASHBOARD_KEY; }
export default async function handler(request, response) {
  if (!authorised(request)) return response.status(401).json({ error: 'Unauthorized' });
  try {
    if (request.method === 'GET') return response.status(200).json({ orders: await listOrders() });
    if (request.method !== 'PATCH') return response.status(405).json({ error: 'Method not allowed' });
    const { id, action } = request.body || {};
    if (!id || !['accepted', 'rejected'].includes(action)) return response.status(400).json({ error: 'Invalid request' });
    const existing = await getOrder(id);
    if (!existing) return response.status(404).json({ error: 'Order not found' });
    if (existing.status === action) return response.status(200).json({ order: existing });
    const order = await updateOrder(id, { status: action, updatedAt: new Date().toISOString() });
    if (action === 'accepted') await sendOrderConfirmedSms(order);
    return response.status(200).json({ order });
  } catch { return response.status(500).json({ error: 'Unable to update order.' }); }
}

