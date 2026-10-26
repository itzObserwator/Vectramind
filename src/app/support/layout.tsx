import type { ReactNode } from "react";

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inner-page product-landing support-page">{children}</div>
  );
}
