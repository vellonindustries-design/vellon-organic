export async function sendOrderConfirmedSms(order) {
  if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) return { skipped: true };
  const mobile = `91${String(order.shipping.phone).replace(/^\+?91/, '')}`;
  const result = await fetch('https://control.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', authkey: process.env.MSG91_AUTH_KEY },
    body: JSON.stringify({ template_id: process.env.MSG91_TEMPLATE_ID, recipients: [{ mobiles: mobile, ORDER_ID: order.id, CUSTOMER_NAME: order.shipping.name }] })
  });
  if (!result.ok) throw new Error('Could not send order confirmation SMS');
  return result.json();
}

