import { ProductLandingHero } from "@/components/pages/product-landing-hero";

export default function Loading() {
  return (
    <>
      <ProductLandingHero product="firstpass" />
      <div className="product-landing-loading-content" role="status">
        <span>Loading your connected platform…</span>
      </div>
    </>
  );
}
