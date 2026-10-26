import type { Metadata } from "next";
import { SynapsePage } from "@/components/pages/synapse-page";
export const metadata: Metadata = {
  title: "Synapse \u2014 Customer Engagement \u2014 Vectramind",
  description:
    "Connect customer conversations across SMS, WhatsApp, email, RCS and more with Synapse by Vectramind.",
};
export default function Page() {
  return <SynapsePage />;
}
