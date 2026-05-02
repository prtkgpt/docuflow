# MyPDFKitty

An all-in-one PDF SaaS — edit, convert, compress, sign, and summarize PDFs with AI. Built with Next.js 14 (App Router), TypeScript, Tailwind, Prisma + Neon Postgres, Vercel Blob, NextAuth, Stripe, and OpenAI.

> **No terminal required.** This project is designed to be deployed using GitHub + Vercel + Neon from the browser.

## Features

- **Upload & preview** — drag-and-drop PDFs, render with `pdfjs-dist`.
- **Workspace** — sidebar tools + center preview + right-side settings panel.
- **PDF tools (working)** — Merge, Split, Rotate, Delete pages, Sign (typed/image), Compress (placeholder), all server-side via `pdf-lib`.
- **AI tools** — Summarize and Chat with PDF using OpenAI (graceful fallback if key missing).
- **Pricing** — Free / Pro / Business with Stripe checkout (mock checkout if Stripe keys missing).
- **Dashboard** — Files, recent activity, billing.
- **Auth** — NextAuth credentials provider (email-only) for the MVP.
- **Storage** — Local for dev, Vercel Blob for production (S3 hook-point in `lib/storage.ts`).

## Browser-only deployment (Vercel + Neon + GitHub)

You do **not** need a terminal. Follow the browser-only steps in [`README-browser-deploy.md`](./README-browser-deploy.md).

Quick summary:

1. Create a GitHub repo and push this code (web UI or any browser-based git client).
2. Create a Neon Postgres project and copy the pooled connection string.
3. Open Neon's **SQL Editor** and paste in:
   - [`database/schema.sql`](./database/schema.sql) (creates tables)
   - [`database/seed.sql`](./database/seed.sql) (optional demo data)
4. Import the GitHub repo into Vercel.
5. In Vercel **Project → Settings → Environment Variables**, add:
   - `DATABASE_URL` (Neon pooled URL)
   - `NEXTAUTH_SECRET` (any random string)
   - `NEXTAUTH_URL` (e.g. `https://your-app.vercel.app`)
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` *(optional — mock checkout used if missing)*
   - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID`
   - `UPLOAD_STORAGE_PROVIDER=vercel-blob`
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob → create a store)
6. Deploy. The build script runs `prisma generate` automatically.

> **Prisma + Vercel + Neon migrations:** Vercel does not run `prisma migrate deploy` during the build by default. The simplest browser-only flow is to apply schema changes via Neon's **SQL Editor** using `database/schema.sql`. If you prefer Prisma migrations, add a Vercel build hook or run them from a temporary environment.

## Project structure

```
app/
  page.tsx              # Homepage
  tools/                # Per-tool landing pages
  workspace/            # Center PDF editor
  dashboard/            # Files, billing, overview
  pricing, login, about, privacy, terms
  api/
    upload, files, stripe, auth
    tools/merge, split, rotate, delete-pages, sign, summarize, chat
components/
  Header, Footer, UploadDropzone, ToolCard, ToolGrid, PdfViewer,
  WorkspaceSidebar, WorkspaceToolbar, ToolSettingsPanel,
  PricingCard, FileTable, ToolPageLayout
lib/
  pdf/{merge,split,rotate,delete-pages,sign,extract-text}.ts
  ai/{openai,summarize}.ts
  storage.ts, auth.ts, db.ts, plans.ts, tools.ts, utils.ts, process.ts
prisma/schema.prisma
database/{schema.sql, seed.sql}
```

## Environment variables

See [`.env.example`](./.env.example).

## Notes

- The compress tool is a placeholder so the UI is honest about what is actually doing
  the work. The `lib/pdf` module is structured so a real worker (e.g. Ghostscript-wasm
  or image down-sampling) can drop in without touching the API surface.
- Storage provider is configurable: `local` (dev), `vercel-blob` (recommended for Vercel),
  or `s3` (hook-point in `lib/storage.ts`).
- All tool API routes return `{ url, size }` so the workspace can offer instant downloads.

## License

MIT.
