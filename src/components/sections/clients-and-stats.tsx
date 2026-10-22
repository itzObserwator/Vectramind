"use client";

import { SectionLabel } from "@/components/site-primitives";
import { CaseStudies } from "@/components/sections/case-studies";
import { ClientLogoMarquee } from "@/components/sections/client-logo-marquee";
export function ClientsAndStats() {
  return (
    <>
      <section id="clients" className="clients-section section-space">
        <div className="page-padding">
          <SectionLabel right="05 / Evolving together">
            Our clients
          </SectionLabel>
          <div className="client-heading">
            <h2 className="display" data-reveal>
              Great companies.
              <br />
              Lasting connections.
            </h2>
            <p>
              Our customized solutions respond to the diverse needs of more than
              800 clients around the world.
            </p>
          </div>
        </div>
        <ClientLogoMarquee />
        <div className="values-table page-padding">
          {[
            [
              "Technology that moves with you",
              "Adaptable platforms built to respond to real business challenges and create better human experiences.",
            ],
            [
              "A connected perspective",
              "Break down silos between systems, teams and touchpoints with seamless integrations.",
            ],
            [
              "Your goals, our direction",
              "Customized solutions shaped around your organization, its people and its potential.",
            ],
            [
              "Responsible innovation",
              "AI guided by a commitment to users, businesses and the trust behind every interaction.",
            ],
          ].map(([title, text]) => (
            <div key={title} data-reveal>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <CaseStudies />
    </>
  );
}
