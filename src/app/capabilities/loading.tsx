import { CapabilitiesHero } from "@/components/pages/capabilities-hero";

export default function Loading() {
  return (
    <>
      <CapabilitiesHero />
      <div className="product-landing-loading-content" role="status">
        Loading our capabilities…
      </div>
    </>
  );
}
