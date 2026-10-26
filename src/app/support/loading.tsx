import { SupportHero } from "@/components/pages/support-hero";

export default function Loading() {
  return (
    <>
      <SupportHero />
      <div className="product-landing-loading-content" role="status">
        Loading support…
      </div>
    </>
  );
}
