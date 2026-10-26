import type { ReactNode } from "react";

export default function FirstpassLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inner-page product-page firstpass-page product-landing firstpass-redesign">
      {children}
    </div>
  );
}
