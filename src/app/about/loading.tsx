import { AboutHero } from "@/components/pages/about-hero";

export default function Loading() {
  return (
    <>
      <AboutHero />
      <div className="product-landing-loading-content" role="status">
        Loading our story…
      </div>
    </>
  );
}
