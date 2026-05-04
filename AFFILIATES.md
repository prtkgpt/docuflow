# Affiliate program signup checklist

The site ships with `/go/<slug>` redirects already wired for the partners
below. Each currently falls back to the partner's official URL with
`rel=nofollow`. To turn one into a paying affiliate link, sign up for the
program, get your tracking link, and paste it into `lib/affiliates.ts`
on the matching partner's `affiliateUrl` field.

The partner's `slug` in `lib/affiliates.ts` matches its `/go/<slug>`
route — so once you've replaced the URL and deployed, every link site-wide
that pointed at `/go/docusign` (etc.) starts earning commission.

---

## Partners shipped (in priority order)

### 1. DocuSign — likely highest EPC for our audience
- **Sign up**: [impact.com](https://impact.com) → search "DocuSign" → apply.
- **Network**: Impact (large, well-known affiliate network).
- **Historical commission**: ~30% of first-year subscription value (verify; rates change).
- **Why it converts on our site**: People landing on `/alternatives/docusign` are actively researching DocuSign — some will switch to us, others will conclude DocuSign is the right fit. Capture the latter group.
- **Approval bar**: Fairly easy. Active site + clear use case is enough.

### 2. Adobe Acrobat (Creative Cloud) — biggest brand
- **Sign up**: [partners.adobe.com](https://partners.adobe.com) → Affiliate Program.
- **Network**: Partnerize / Tradedoubler depending on region.
- **Historical commission**: Per-signup bounty on Creative Cloud + Acrobat plans.
- **Why it converts on our site**: `/alternatives/adobe-acrobat` traffic.
- **Approval bar**: Higher than most — active site with reasonable traffic helps.

### 3. PandaDoc — sales-team document automation
- **Sign up**: [partnerstack.com](https://partnerstack.com) → search "PandaDoc" → apply.
- **Network**: PartnerStack.
- **Historical commission**: Per paid signup. Verify current rate.
- **Why it converts on our site**: Adjacent to send-for-signature audience — people upgrading from basic e-sign to full document automation.

### 4. Dropbox — for "PDF too big to email" overflow
- **Sign up**: [impact.com](https://impact.com) → search "Dropbox" → apply.
- **Network**: Impact.
- **Historical commission**: ~$25 per Plus signup. Verify current.
- **Why it converts on our site**: Naturally pairs with our compress-pdf-for-email page — when compression isn't enough, "use a Drive link" becomes "use a Dropbox link".

### 5. Notion — adjacent productivity
- **Sign up**: [notion.com](https://www.notion.com) → footer → Affiliate Program.
- **Network**: Direct (no third-party network).
- **Historical commission**: 50% recurring for the first 12 months on referred paid plans.
- **Why it converts on our site**: Many users using PDFs are also building wikis / docs — natural cross-sell on blog posts and dashboard.

### 6. Grammarly — writing assistant
- **Sign up**: [cj.com](https://cj.com) → Publisher signup → search "Grammarly" → apply.
- **Network**: CJ Affiliate (Commission Junction).
- **Historical commission**: ~$20 per Premium signup. Verify current.
- **Why it converts on our site**: People polishing resumes, contracts, cover letters — natural fit on `/tools/merge-pdf-for-resume` and similar.

### 7. Calendly — scheduling
- **Sign up**: [impact.com](https://impact.com) → search "Calendly" → apply.
- **Network**: Impact.
- **Historical commission**: Per paid signup. Verify current.
- **Why it converts on our site**: Lower-relevance fit; consider only after the others are live.

---

## Adding a partner

```ts
// lib/affiliates.ts
{
  slug: "dropbox",
  name: "Dropbox",
  officialUrl: "https://www.dropbox.com",
  affiliateUrl: "https://dropbox.sjv.io/aBcDeF?...",  // ← paste your real tracking link here
  programNote: "...",
  blurb: "...",
  relevantOn: ["smallpdf", "ilovepdf"],
}
```

Once `affiliateUrl` is set:
- `/go/dropbox` redirects to your affiliate URL (instead of the official URL).
- Anywhere `<AffiliateLink partner="dropbox">` is rendered, the link will:
  - Use `rel="sponsored noopener noreferrer"` (the right Google signal for affiliate links).
  - Show the FTC affiliate disclosure where used.

---

## FTC compliance

- The `<AffiliateDisclosure />` component is rendered on every alternatives page that has at least one active affiliate. **Don't remove it** — FTC requires "clear and conspicuous" disclosure when you stand to earn commission.
- Don't add affiliate links to email content unless your email also discloses.
- For sponsored content (which we currently don't run), add `<p>Sponsored</p>` at the top of the page.

---

## Where the links currently appear

- `/alternatives/<slug>` — "Still considering [Competitor]?" sidebar at the bottom of each comparison page.
- Anywhere else you add `<AffiliateLink partner="...">` in JSX.

---

## How to verify a click is being tracked

1. Open Vercel logs.
2. Click `/go/<slug>` in production.
3. Look for a `[outbound]` log line — should appear within seconds.
4. Then check the partner's affiliate dashboard for the click (varies by program; Impact is real-time, CJ has a few hours of delay, others vary).

If clicks show up in Vercel logs but not in the partner dashboard, the affiliate URL is wrong — re-copy from the partner's dashboard.
