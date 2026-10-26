import { products } from "./products";

const generalFaqs = [
  [
    "How do I contact the support team?",
    "Email support@vectramind.com or prepare an enquiry using the form below. Include your product, organization, a description of the issue and any relevant steps to reproduce it.",
  ],
  [
    "What should I include in my support request?",
    "Include the platform you use, a brief description of the issue, when it occurred, and the steps leading up to it. Avoid including patient records, passwords or other sensitive details.",
  ],
] as const;

export const supportGroups = [
  {
    id: "all",
    label: "All answers",
    items: [
      ...products.synapse.faqs,
      ...products.firstpass.faqs,
      ...generalFaqs,
    ],
  },
  { id: "synapse", label: "Synapse", items: products.synapse.faqs },
  { id: "firstpass", label: "Firstpass", items: products.firstpass.faqs },
  { id: "general", label: "General", items: generalFaqs },
] as const;
