import type { Metadata } from "next";
import { ProductPage } from "@/components/pages/product-page";
export const metadata: Metadata = {
  title: "Firstpass \u2014 Unified Patient Experience \u2014 Vectramind",
  description:
    "Connect scheduling, patient flow, engagement and real-time governance with Firstpass by Vectramind.",
};
export default function Page() {
  return <ProductPage product="firstpass" />;
}
