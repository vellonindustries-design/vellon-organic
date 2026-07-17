import { kv } from '@vercel/kv';

export async function saveOrder(order) {
  await kv.set(`order:${order.id}`, order);
  await kv.zadd('vellon:orders', { score: Date.now(), member: order.id });
}

export async function listOrders() {
  const ids = await kv.zrange('vellon:orders', 0, -1, { rev: true });
  if (!ids.length) return [];
  const orders = await Promise.all(ids.map(id => kv.get(`order:${id}`)));
  return orders.filter(Boolean);
}

export async function getOrder(id) { return kv.get(`order:${id}`); }
export async function updateOrder(id, changes) {
  const current = await getOrder(id);
  if (!current) return null;
  const next = { ...current, ...changes };
  await kv.set(`order:${id}`, next);
  return next;
}

