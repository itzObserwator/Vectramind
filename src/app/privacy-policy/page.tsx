import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
export const metadata: Metadata = {
  title: "Privacy Policy \u2014 Vectramind",
  description:
    "Vectramind\u2019s published website and application privacy policies.",
};
export default function Page() {
  return <LegalPage type="privacy" />;
}
