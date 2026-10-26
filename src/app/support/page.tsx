import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/support-page";
export const metadata: Metadata = {
  title: "Support \u2014 We\u2019re With You \u2014 Vectramind",
  description: "Find answers and connect with Vectramind product support.",
};
export default function Page() {
  return <SupportPage />;
}
