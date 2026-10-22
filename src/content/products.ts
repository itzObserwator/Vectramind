export const products = {
  synapse: {
    name: "Synapse",
    category: "Customer engagement, connected",
    headline: ["Every message.", "More human."],
    description:
      "Turn functional messaging into engaging conversations. Reach your customers across channels, build stronger relationships, and grow one conversation at a time.",
    intro: "Because there’s a relationship in every conversation.",
    introText:
      "Synapse brings your customer communications together. From a timely appointment reminder to a two-way conversation, connect the right message with the right person, at the right moment.",
    metrics: [
      ["800+", "clients worldwide"],
      ["2B+", "notifications per year"],
      ["30+", "partners, channels & integrations"],
    ],
    features: [
      [
        "Reach at scale",
        "Built for high-throughput enterprise messaging, with support for sending up to 10,000 messages per second.",
      ],
      [
        "Campaigns on your terms",
        "Schedule campaigns for future dates, pause or reschedule them, and manage communications around your business.",
      ],
      [
        "A clearer view",
        "Comprehensive dashboards and channel-level reporting keep you informed about message delivery and performance.",
      ],
      [
        "Quality before every send",
        "Maker Checker helps your team review and approve messaging before a campaign goes live.",
      ],
      [
        "Your systems, connected",
        "Integrate with core systems through APIs, database connections and HL7 to enable real-time messaging.",
      ],
      [
        "Control where it counts",
        "Allocate messaging credits across departments and users. Prioritize important communications and manage applications centrally.",
      ],
    ],
    modules: [
      [
        "SMS & RCS",
        "Reach customers with notifications, alerts and richer mobile messaging.",
      ],
      ["WhatsApp", "Keep conversations going in a familiar messaging channel."],
      ["Email", "Bring email into your wider customer engagement strategy."],
      ["Chatbots", "Support responsive, automated customer conversations."],
      [
        "Push & web notifications",
        "Keep customers informed across your digital touchpoints.",
      ],
      [
        "Social messaging",
        "Extend your reach through connected social messaging channels.",
      ],
    ],
    faqs: [
      [
        "Which channels does Synapse support?",
        "Synapse connects channels including SMS, email, WhatsApp, RCS, push and web notifications, chatbots and social messaging. Talk to the team about the channels and integrations your business requires.",
      ],
      [
        "Can Synapse connect to our existing systems?",
        "Yes. Vectramind supports API- and database-based integrations, including healthcare integrations using HL7. The team can review your specific systems and deployment requirements.",
      ],
      [
        "Can our teams manage and approve campaigns?",
        "Synapse includes campaign scheduling, credit management, priority messaging and Maker Checker approval capabilities.",
      ],
    ],
  },
  firstpass: {
    name: "Firstpass",
    category: "Your unified patient experience platform",
    headline: ["Better journeys.", "Happier patients."],
    description:
      "Connect every touchpoint of the patient experience. Bring scheduling, patient flow, communication and real-time governance into one AI-native platform.",
    intro: "Take the dis-appointment out of appointments.",
    introText:
      "Firstpass connects the patient journey with your facility’s operations. Real-time insights help your team optimize resources, reduce friction, and make more informed decisions about care delivery.",
    metrics: [
      ["5M+", "patient engagements per year"],
      ["9", "connected platform modules"],
      ["4", "pillars of a better experience"],
    ],
    features: [
      [
        "Patients",
        "Give people a clearer picture of their journey through smart patient management and streamlined communication.",
      ],
      [
        "Productivity",
        "Understand appointments, check-ins, walk-ins, no-shows, wait times and department trends to identify opportunities for improvement.",
      ],
      [
        "People",
        "Give doctors, nurses and care teams visibility into which patient is being served, where and when.",
      ],
      [
        "Providers",
        "Connect touchpoints and use data-driven insights to optimize facility resources and improve operational visibility.",
      ],
    ],
    modules: [
      [
        "fp scheduler",
        "Appointment scheduling that creates a simpler digital front door.",
      ],
      ["fp kyp", "Patient verification and insurance authentication."],
      [
        "fp consent forms",
        "Consent management for a more connected patient journey.",
      ],
      ["fp flow", "Patient flow management across your facility."],
      ["fp connect", "The integration layer that connects your systems."],
      ["fp engage", "Patient communications at meaningful moments."],
      ["fp livecast", "Real-time governance and analytics."],
      ["fp feedback", "Patient feedback and surveys."],
      ["fp escalate", "An escalation engine to keep teams informed."],
    ],
    faqs: [
      [
        "Does Firstpass support the complete patient journey?",
        "Its nine connected modules cover scheduling, verification, consent, patient flow, integration, communications, governance, feedback and escalation.",
      ],
      [
        "Can modules work independently?",
        "Firstpass modules are designed to work individually and as part of an integrated whole. The team can help you choose an approach that fits your facility.",
      ],
      [
        "How does Firstpass help care teams?",
        "Firstpass brings together visibility into patient status, waiting and transit times, facility operations and real-time analytics to support informed decisions.",
      ],
    ],
  },
} as const;
export type ProductKey = keyof typeof products;
