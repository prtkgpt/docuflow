// Cross-origin downloads (e.g. Vercel Blob URLs) ignore the HTML
// `download` attribute unless the response includes a
// Content-Disposition: attachment header. Vercel Blob honors a
// `?download=<filename>` query param that adds that header on the fly,
// so we append it whenever the URL is absolute. Same-origin URLs (local
// dev /api/files/raw/...) keep working with the regular download attr.
export function asDownloadUrl(url: string, filename?: string): string {
  if (!url) return url;
  if (url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("download")) {
      u.searchParams.set("download", filename || "1");
    }
    return u.toString();
  } catch {
    return url;
  }
}
