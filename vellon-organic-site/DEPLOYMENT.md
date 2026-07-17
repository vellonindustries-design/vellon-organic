# Publish Vellon Organic

This storefront is ready for Vercel. The Razorpay secret key stays only in Vercel environment variables and is never sent to a shopper's browser.

## Before publishing

1. Create a Vercel account at https://vercel.com and install the Vercel CLI, or import this folder through the Vercel dashboard.
2. In **Project Settings → Environment Variables**, add:
   - `RAZORPAY_KEY_ID` — the Razorpay **test** Key ID from the supplied CSV.
   - `RAZORPAY_KEY_SECRET` — the matching Razorpay **test** Key Secret from the supplied CSV.
   - `KV_REST_API_URL` and `KV_REST_API_TOKEN` — from a Vercel KV database connected to this project, so paid orders appear in `/admin/`.
   - `ADMIN_DASHBOARD_KEY` — a new, long private password used to open `/admin/`.
   - `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` — from MSG91, after its transactional SMS template has `ORDER_ID` and `CUSTOMER_NAME` variables. These send the confirmation SMS when you accept an order.
3. Deploy. Test the full checkout with Razorpay test payments.
4. When the business is ready to accept real payments, replace both environment variables with the Razorpay **live** Key ID and Key Secret, then redeploy.

## Connect GoDaddy domain

After Vercel gives a production deployment:

1. In Vercel, open **Settings → Domains** and add `vellonorganic.com` and `www.vellonorganic.com`.
2. Vercel will show the exact DNS values. In GoDaddy, open **My Products → Domains → DNS → Manage DNS** and add those records.
3. Remove any conflicting `@` or `www` records only when Vercel explicitly tells you to.
4. Wait for Vercel to verify the domain and issue HTTPS automatically.

## Important payment note

Test credentials cannot accept real customer money. Do not use a real Razorpay key in `.env`, source code, email, or chat. Add it only in Vercel's encrypted environment-variable panel.
