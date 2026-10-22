import type { Metadata } from "next";
import { CapabilitiesPage } from "@/components/pages/company-pages";
export const metadata: Metadata = {
  title:
    "Capabilities \u2014 Intelligence, Design & Integration \u2014 Vectramind",
  description:
    "Explore Vectramind\u2019s artificial intelligence, solution design and integration expertise.",
};
export default function Page() {
  return <CapabilitiesPage />;
}
