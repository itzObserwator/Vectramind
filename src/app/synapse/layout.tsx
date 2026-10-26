import type { ReactNode } from "react";

export default function SynapseLayout({ children }: { children: ReactNode }) {
  // Keep this root stable while the route loading boundary swaps its content,
  // so the shared native scroll-reveal observer sees the new sections.
  return (
    <div className="inner-page product-page synapse-page synapse-redesign product-landing">
      {children}
    </div>
  );
}
