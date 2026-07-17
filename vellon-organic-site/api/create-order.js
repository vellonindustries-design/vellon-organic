const catalogue = {kit:399,orange:164,neem:120,amla:169,hibiscus:179,shikakai:199,reetha:199,moringa:199,multani:139,bhringraj:179,'face-combo':199};

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  try {
    const { items, shipping } = request.body || {};
    if (!Array.isArray(items) || !items.length) return response.status(400).json({ error: 'Your bag is empty.' });
    const total = items.reduce((sum, item) => sum + (catalogue[item.id] || 0) * Math.max(1, Number(item.qty) || 1), 0);
    if (!total) return response.status(400).json({ error: 'Invalid products in bag.' });
    if (!shipping?.name || !/^[0-9]{10}$/.test(shipping.phone || '') || !shipping?.address || !shipping?.city || !shipping?.state || !/^[0-9]{6}$/.test(shipping.pincode || '')) return response.status(400).json({ error: 'Please complete a valid delivery address.' });
    const credentials = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total * 100, currency: 'INR', receipt: `vellon_${Date.now()}`, notes: { store: 'vellonorganic.com', customer: shipping.name, phone: shipping.phone, address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}` } }) });
    const order = await orderResponse.json();
    if (!orderResponse.ok) throw new Error(order.error?.description || 'Razorpay order creation failed');
    return response.status(200).json({ id: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) { return response.status(500).json({ error: 'Secure checkout is temporarily unavailable.' }); }
}
