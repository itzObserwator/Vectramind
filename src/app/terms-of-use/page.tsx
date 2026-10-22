import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
export const metadata: Metadata = {
  title: "Terms of Use \u2014 Vectramind",
  description:
    "Vectramind\u2019s published terms of use for Synapse and Firstpass services.",
};
export default function Page() {
  return <LegalPage type="terms" />;
}
