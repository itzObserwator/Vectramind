import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inner-page product-landing about-page">{children}</div>
  );
}
