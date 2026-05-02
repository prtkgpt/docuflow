// Subpath imports of pdfjs-dist don't ship .d.ts files; declare them as `any`
// so dynamic imports type-check on Vercel. Runtime behavior is unaffected.
declare module "pdfjs-dist/build/pdf.mjs";
declare module "pdfjs-dist/legacy/build/pdf.mjs";
