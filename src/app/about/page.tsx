import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
export const metadata: Metadata = {
  title: "About Vectramind \u2014 With You in Mind \u2014 Vectramind",
  description:
    "Meet the people, mission and perspective behind Vectramind\u2019s transformative platforms.",
};
export default function Page() {
  return <AboutPage />;
}
