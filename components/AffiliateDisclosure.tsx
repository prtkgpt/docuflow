// FTC-style disclosure for affiliate-link pages.
// US FTC requires a "clear and conspicuous" disclosure when you stand to
// earn commission from links on a page — this component is small but
// always-visible, which is what they ask for.

export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-slate-500 ${className}`}>
      Disclosure: This page may contain affiliate links. If you click through
      and sign up for a partner&apos;s product, we may earn a commission at no
      extra cost to you. Our recommendations are based on what we genuinely
      think is the best fit — affiliate status doesn&apos;t change the rankings.
    </p>
  );
}
