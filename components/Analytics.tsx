import Script from "next/script";

// Google Analytics 4 install. Defaults to the production measurement ID;
// override with NEXT_PUBLIC_GA_MEASUREMENT_ID on staging/preview if you'd
// rather not pollute production analytics. Set the env var to an empty
// string to disable GA entirely on that environment.
const DEFAULT_GA_ID = "G-6RNV2CJVB0";

export function Analytics() {
  const envId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const id = envId === undefined ? DEFAULT_GA_ID : envId.trim();
  if (!id) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
