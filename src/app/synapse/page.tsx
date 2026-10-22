import type { Metadata } from "next";
import { ProductPage } from "@/components/pages/product-page";
export const metadata: Metadata = {
  title: "Synapse \u2014 Customer Engagement \u2014 Vectramind",
  description:
    "Connect customer conversations across SMS, WhatsApp, email, RCS and more with Synapse by Vectramind.",
};
export default function Page() {
  return <ProductPage product="synapse" />;
}
