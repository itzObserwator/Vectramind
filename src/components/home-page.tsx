"use client";
import { ExperienceHero } from "@/components/experience/hero";
import { ExperienceIntroduction } from "@/components/experience/introduction";
import { ExperienceCapabilities } from "@/components/experience/capabilities";
import { ConnectedEcosystem } from "@/components/experience/ecosystem";
import { GlobalReach } from "@/components/experience/global-reach";
import { OurPlatforms } from "@/components/experience/our-platforms";
import { ClientStrip } from "@/components/sections/client-strip";
import { ClientsAndStats } from "@/components/sections/clients-and-stats";
import { Stories } from "@/components/sections/stories";
import { People } from "@/components/sections/people";
// The visual reference changes here; shared product/company pages keep their content.
export function HomePage() {
  return (
    <div className="experience-home">
      <ExperienceHero />
      <ClientStrip />
      <ExperienceIntroduction />
      <ExperienceCapabilities />
      <ConnectedEcosystem />
      <OurPlatforms />
      <GlobalReach />
      <ClientsAndStats />
      <Stories />
      <People />
    </div>
  );
}
