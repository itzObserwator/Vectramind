import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/company-pages";
export const metadata: Metadata = {
  title: "Careers \u2014 Open Minds, New Possibilities \u2014 Vectramind",
  description:
    "Discover life at Vectramind and start a conversation about your next opportunity.",
};
export default function Page() {
  return <CareersPage />;
}
