import { SynapseHero } from "@/components/pages/synapse-hero";

export default function Loading() {
  return (
    <>
      <SynapseHero />
      <div className="product-landing-loading-content" role="status">
        <span>Loading your connected platform…</span>
      </div>
    </>
  );
}
