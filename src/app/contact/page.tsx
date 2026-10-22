import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-pages";
export const metadata: Metadata = {
  title: "Contact Vectramind \u2014 Vectramind",
  description:
    "Talk to Vectramind about Synapse, Firstpass, custom solutions, careers or product support.",
};
export default function Page() {
  return <ContactPage />;
}
