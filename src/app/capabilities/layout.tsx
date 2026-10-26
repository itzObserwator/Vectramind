import type { ReactNode } from "react";

export default function CapabilitiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="inner-page product-landing capabilities-page">
      {children}
    </div>
  );
}
