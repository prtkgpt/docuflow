# Stripe setup — go-live checklist

Follow these steps once and MyPDFKitty's pricing page, signup → checkout flow,
billing portal, and AI credit packs will be fully functional with real payments.
**Do everything in Test mode first**, then flip to Live mode and repeat steps 2–6.

---

## 0. Prerequisites

- Stripe account: https://dashboard.stripe.com
- Vercel project linked to GitHub repo `prtkgpt/docuflow`
- Production domain set up (`mypdfkitty.com`)

Toggle Stripe → top-right corner → **Test mode** while you set this up.

---

## 1. Create the four products + prices

In Stripe → **Products → + Add product**. Create one Product per plan; each
Product needs **two recurring Prices** (monthly and annual).

### Kitty Plus
- Name: `Kitty Plus`
- Description: `For students, freelancers, and everyday PDF work.`
- Add Price #1: `$2.99` / Recurring / Monthly → copy the **Price ID** (`price_...`)
- Add Price #2: `$24.00` / Recurring / Yearly → copy the **Price ID**

### Kitty Pro
- Name: `Kitty Pro`
- Description: `For power users who work with PDFs often.`
- Price #1: `$5.99` / Monthly → copy ID
- Price #2: `$49.00` / Yearly → copy ID

### Business
- Name: `Business`
- Description: `For small teams. 3 seats included.`
- Price #1: `$12.99` / Monthly → copy ID
- Price #2: `$99.00` / Yearly → copy ID

### AI credit packs (one-time, NOT recurring)
Three more Products with **one-time** prices:

- `AI Credits — Starter` · one-time `$5.00` → copy ID
- `AI Credits — Standard` · one-time `$10.00` → copy ID
- `AI Credits — Power` · one-time `$20.00` → copy ID

(Tip: in Test mode the prices can be created with arbitrary amounts; just be
sure to use the **same dollar amounts** when you re-create them in Live mode.)

---

## 2. Add the price IDs to Vercel

Vercel → your project → **Settings → Environment Variables** → add for
**Production** (and Preview if you want test deploys to take real money,
which you usually don't):

```
STRIPE_PLUS_MONTHLY_PRICE_ID=price_…
STRIPE_PLUS_ANNUAL_PRICE_ID=price_…
STRIPE_PRO_MONTHLY_PRICE_ID=price_…
STRIPE_PRO_ANNUAL_PRICE_ID=price_…
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_…
STRIPE_BUSINESS_ANNUAL_PRICE_ID=price_…
STRIPE_CREDIT_PACK_SMALL_PRICE_ID=price_…
STRIPE_CREDIT_PACK_MEDIUM_PRICE_ID=price_…
STRIPE_CREDIT_PACK_LARGE_PRICE_ID=price_…
```

Also add (if not already there):

```
STRIPE_SECRET_KEY=sk_test_…   # later: sk_live_…
```

---

## 3. Configure the webhook

Stripe → **Developers → Webhooks → + Add endpoint**.

- **Endpoint URL**: `https://mypdfkitty.com/api/stripe/webhook`
- **Events to send**:
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated` *(optional — for future plan-change handling)*
- Click **Add endpoint** → click into it → **Reveal signing secret** → copy it.

Add to Vercel env vars:

```
STRIPE_WEBHOOK_SECRET=whsec_…
```

The webhook (`/api/stripe/webhook`) handles two events the app cares about:
1. **Subscription start** — when `mode === "subscription"` it upserts the user's
   `Subscription` row with the new plan ID.
2. **Credit pack purchase** — when `metadata.purchase === "credit_pack"` it adds
   the pack's question count to `User.chatQuestionsCredits`.

---

## 4. Enable the Customer Portal

Stripe → **Settings → Billing → Customer portal**.

- Toggle **Activate**.
- **Functionality** → enable: cancel subscription, update payment method,
  view invoices.
- **Branding** → upload the MyPDFKitty logo if you'd like.
- Save.

This is what the **Manage subscription** button on `/dashboard/billing` opens
via `/api/stripe/portal`.

---

## 5. Redeploy

Trigger a redeploy in Vercel so the new env vars apply. The build will pick
them up automatically; no code changes needed for any of this.

---

## 6. End-to-end test (Test mode)

Use Stripe test cards (e.g. `4242 4242 4242 4242`, any future expiry, any CVC,
any postal). Run all six flows:

1. **Free signup** — `/signup` → enter email → click magic link → land on
   `/dashboard?welcome=1` with the welcome card visible.
2. **Plus monthly** — `/pricing` → toggle stays on Monthly → click `Upgrade
   to Plus` → complete Stripe Checkout → return to `/dashboard/billing` →
   plan should read **Plus**.
3. **Plus annual** — repeat with the toggle flipped to Annual. The
   `Best value` badge should appear; checkout shows `$24/year`.
4. **Pro / Business** — repeat for both, both intervals.
5. **AI credit pack** — `/pricing` → scroll to the credit pack section →
   click `Buy pack` on `$10` → checkout → return → `/dashboard` should
   show `+1500 credit pack questions` next to your chat counter.
6. **Manage subscription** — `/dashboard/billing` → click `Manage
   subscription` → Stripe portal opens → cancel the test subscription →
   return → plan reverts to Free (this depends on the
   `customer.subscription.deleted` webhook firing).

For every flow, confirm in **Stripe → Webhooks → your endpoint** that the
deliveries returned `200`. If anything is red, the response body will show
the error from `/api/stripe/webhook`.

---

## 7. Flip to Live mode

When tests pass:

1. Toggle Stripe to **Live mode** (top-right corner).
2. Re-create all 9 Products + Prices with the same dollar amounts.
3. Generate Live API keys (Developers → API keys).
4. Re-create the Live webhook (same URL, same events).
5. Update Vercel env vars with the **Live** keys + IDs:
   - `STRIPE_SECRET_KEY=sk_live_…`
   - `STRIPE_WEBHOOK_SECRET=whsec_…` (the Live one)
   - All nine Live `price_…` IDs
6. Redeploy.
7. Run flow #2 once with a real card to confirm Live works (Stripe lets you
   refund yourself immediately).

---

## 8. Optional polish

- **Tax**: Stripe → Settings → Tax → enable automatic tax. Then add
  `automatic_tax: { enabled: true }` to `/api/stripe/checkout/route.ts` if
  you want it applied at checkout.
- **Promo codes**: already enabled on Checkout (`allow_promotion_codes: true`).
  Create coupons in Stripe → Marketing → Coupons.
- **Trial period**: add `subscription_data: { trial_period_days: 7 }` to the
  Checkout session create call to give a free trial.
- **Email receipts**: Stripe → Settings → Emails → toggle on.

---

## Troubleshooting

- **Checkout returns the mock URL `…/pricing?checkout=mock`** → one of
  `STRIPE_SECRET_KEY` or the price ID env var is missing for that plan.
  The route falls back to a mock page so the UI still works.
- **Webhook 400 with "Invalid signature"** → the `STRIPE_WEBHOOK_SECRET`
  env var doesn't match the endpoint. Re-copy it from Stripe and redeploy.
- **Portal returns "No active subscription"** → user has no
  `stripeCustomerId` because the webhook didn't fire after signup. Resend
  the latest `checkout.session.completed` event from Stripe → Webhooks →
  endpoint → recent deliveries → click → resend.
