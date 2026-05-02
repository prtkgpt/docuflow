# Browser-only deployment guide

This guide walks you through deploying MyPDFKitty without a terminal, using only the GitHub, Neon, and Vercel web UIs.

## 1. Push the code to GitHub

- Go to [github.com/new](https://github.com/new) and create a repository (e.g. `docuflow`).
- Use GitHub's web UI to upload the project files, or use any browser-based editor (e.g. github.dev) to push.
- Commit to your default branch.

## 2. Create the Neon database

1. Sign in to [neon.tech](https://neon.tech) and create a new project.
2. Open the **SQL Editor** for your database.
3. Paste the contents of [`database/schema.sql`](./database/schema.sql) and click **Run**. This creates every table and index MyPDFKitty needs.
4. *(Optional)* In a new query, paste [`database/seed.sql`](./database/seed.sql) and click **Run** to add demo users and files. `seed.sql` is self-contained — it re-creates any missing tables (`CREATE TABLE IF NOT EXISTS`), so it's safe to run on its own or after `schema.sql`.
5. Open **Connection Details** and copy the **pooled connection string** (it ends in `?sslmode=require&pgbouncer=true&connect_timeout=15`). This is your `DATABASE_URL`.

> Always use the pooled URL on Vercel — serverless functions create new connections frequently.

## 3. Create a Vercel Blob store (file uploads)

1. Sign in to [vercel.com](https://vercel.com).
2. Go to **Storage → Create → Blob** and create a store.
3. Vercel will generate a `BLOB_READ_WRITE_TOKEN` — copy it.

## 4. Import the repository into Vercel

1. From the Vercel dashboard, click **Add New… → Project**.
2. Pick the GitHub repo you created in step 1.
3. Framework: **Next.js** (auto-detected).
4. Don't deploy yet — open **Environment Variables** first.

## 5. Set environment variables

Add the following under **Settings → Environment Variables** (Production, Preview, Development):

| Key | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Neon **pooled** connection string |
| `NEXTAUTH_SECRET` | yes | Any random 32+ char string |
| `NEXTAUTH_URL` | yes | Your Vercel URL, e.g. `https://mypdfkitty.com` |
| `OPENAI_API_KEY` | optional | Enables AI Summarize / Chat |
| `STRIPE_SECRET_KEY` | optional | Enables real Stripe checkout |
| `STRIPE_WEBHOOK_SECRET` | optional | For `/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | optional | Stripe Pro price ID |
| `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID` | optional | Stripe Business price ID |
| `UPLOAD_STORAGE_PROVIDER` | yes | `vercel-blob` for production |
| `BLOB_READ_WRITE_TOKEN` | yes (with Blob) | From step 3 |
| `ADMIN_EMAILS` | optional | Comma-separated emails allowed into `/master-admin` (the blog CMS) |

## 6. Deploy

Click **Deploy**. The build runs `prisma generate && next build`. You should see your Vercel URL within ~1 minute.

## 7. Post-deploy checklist

- Visit `/` and upload a PDF — you should land on `/workspace?fileId=...`.
- Run **Split** with `1`. Confirm the download link works.
- Run **AI summarize** if `OPENAI_API_KEY` is set.
- Visit `/dashboard/files` to see your uploads listed.
- Visit `/pricing` and click **Upgrade**. With Stripe configured you'll be redirected to Checkout; otherwise you'll see the mock checkout flow.

## 8. Updating the schema later

When you change `prisma/schema.prisma`:

- **Recommended (browser-only):** translate the change into SQL and run it in Neon's SQL Editor.
- **Alternative:** open the project in [github.dev](https://github.dev) (browser VS Code) and run `npx prisma migrate dev --name <name>` from its built-in terminal, then commit the migration files. Vercel's build will pick up the new schema; for production data you'd still apply the migration via Neon's SQL Editor or the Vercel CLI.

## Troubleshooting

- **`PrismaClientInitializationError: Environment variable not found: DATABASE_URL`** — Set `DATABASE_URL` in Vercel and redeploy.
- **PDFs render blank in `/workspace`** — Check that the file is reachable from the browser. With `UPLOAD_STORAGE_PROVIDER=vercel-blob` it returns a public Blob URL.
- **AI summary returns a placeholder** — `OPENAI_API_KEY` isn't set. The app intentionally keeps working without one.
- **Stripe redirect fails** — Set `STRIPE_SECRET_KEY` and the price IDs. Without them, the API returns a mock checkout URL.
