"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  AiBrain01Icon,
  SmartPhone01Icon,
  Mail01Icon,
  WhatsappIcon,
  Calendar03Icon,
  ChartLineData01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";

import { Arrow, SectionLabel } from "@/components/site-primitives";
const channels = [
  { title: "SMS & RCS", icon: SmartPhone01Icon },
  { title: "WhatsApp", icon: WhatsappIcon },
  { title: "Email", icon: Mail01Icon },
  { title: "Chatbots", icon: Message01Icon },
  { title: "Appointment scheduling", icon: Calendar03Icon },
  { title: "Patient engagement", icon: AiBrain01Icon },
  { title: "Real-time insights", icon: ChartLineData01Icon },
  { title: "Connected systems", icon: Link01Icon },
  { title: "Web & push notifications", icon: SmartPhone01Icon },
];
export function Products() {
  return (
    <section id="products" className="products page-padding section-space">
      <SectionLabel right="02 / Our platforms">What we do</SectionLabel>
      <h2 className="display section-heading" data-reveal>
        Your vision.
        <br />
        Our intelligent platforms.
      </h2>
      <div className="product-intro">
        <p data-reveal>
          We build transformative platforms that adapt and evolve with advanced
          technology. Connecting people. Simplifying journeys. Moving the world
          forward.
        </p>
        <div className="product-links">
          <a href="#synapse">
            <img
              src="/images/synapse.svg"
              alt="Synapse"
              width="138"
              height="46"
            />
            <span>Customer engagement</span>
            <Arrow />
          </a>
          <a href="#firstpass">
            <img
              src="/images/firstpass.svg"
              alt="Firstpass"
              width="138"
              height="46"
            />
            <span>Patient experience</span>
            <Arrow />
          </a>
        </div>
      </div>
      <div className="channel-grid">
        {channels.map((c) => (
          <a
            href={
              c.title.includes("Patient") || c.title.includes("Appointment")
                ? "#firstpass"
                : "#synapse"
            }
            className="channel"
            key={c.title}
            data-reveal
          >
            <span className="channel-icon">
              <HugeiconsIcon icon={c.icon} size={30} strokeWidth={1.3} />
            </span>
            <span>{c.title}</span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}
