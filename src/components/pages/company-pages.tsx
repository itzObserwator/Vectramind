"use client";
import Link from "next/link";
import { capabilities, offices } from "@/content/site";
import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
import {
  PageHero,
  IntroSection,
  FeatureGrid,
  PageCta,
} from "./page-primitives";
import { People } from "@/components/sections/people";

const expertise = [
  {
    id: "artificial-intelligence",
    title: "Artificial intelligence",
    lead: "Turn intelligence into action.",
    text: "Extract meaningful insights from data with AI-powered platforms, proprietary algorithms and pattern recognition. Make informed decisions and build experiences around the people behind the data.",
    items: [
      "Proprietary algorithms",
      "Intelligent queuing & adaptive routing",
      "Pattern recognition",
      "Responsible AI",
    ],
    image: "adapt-evolve.webp",
  },
  {
    id: "solution-design",
    title: "Solution design & development",
    lead: "Agility starts with the right design.",
    text: "Build tools and products around the needs of your business. Our adaptable digital solutions help you respond to an evolving technology landscape, with change management and product development working together.",
    items: [
      "Customized digital solutions",
      "UI & UX assessment",
      "Cultural change management",
      "Product lifecycle management",
    ],
    image: "about_culture.webp",
  },
  {
    id: "integration-services",
    title: "Integration services",
    lead: "Where data flows, value follows.",
    text: "Connect the systems that power your organization. We bridge EMRs, pharmacy systems, labs, databases and applications with flexible, bi-directional integrations that support visibility across your business.",
    items: [
      "API- and database-based integration",
      "Bi-directional synchronization",
      "Healthcare system connectivity",
      "Ongoing maintenance & upgrades",
    ],
    image: "office.webp",
  },
];
export function CapabilitiesPage() {
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Our capabilities"
        title={["New possibilities.", "Shared direction."]}
        description="Intelligence, design and integration. Bring the right expertise together to solve complex challenges and create better human experiences."
        cta="Find your direction"
      >
        <div className="expertise-art">
          <div className="expertise-circle">
            <Mark />
            <span>Intelligence</span>
          </div>
          <div className="expertise-circle">
            <Mark />
            <span>Experience</span>
          </div>
          <div className="expertise-circle">
            <Mark />
            <span>Integration</span>
          </div>
        </div>
      </PageHero>
      <nav
        className="page-jump-nav page-padding"
        aria-label="Explore capabilities"
      >
        {expertise.map((e, i) => (
          <a key={e.id} href={`#${e.id}`}>
            <span>0{i + 1}</span>
            {e.title}
            <Arrow />
          </a>
        ))}
      </nav>
      <IntroSection
        label="Expertise that moves you forward"
        title="Best-in-class technology. Your business potential."
        text="Our clients partner with us to build comprehensive, solution-oriented technology plans. We combine a clear understanding of your business with the expertise to turn possibility into practical progress."
      />
      {expertise.map((item, i) => (
        <section
          key={item.id}
          id={item.id}
          className={`expertise-section page-padding ${i % 2 ? "inner-panel" : ""}`}
        >
          <SectionLabel right={`0${i + 1} / Our expertise`}>
            {item.title}
          </SectionLabel>
          <div className="expertise-detail">
            <div className="expertise-photo">
              <img
                src={`/images/${item.image}`}
                alt={`Vectramind ${item.title.toLowerCase()}`}
                loading="lazy"
                data-parallax
              />
              <span className="display">0{i + 1}</span>
            </div>
            <div>
              <h2 data-reveal>{item.lead}</h2>
              <p>{item.text}</p>
              <ul>
                {item.items.map((name) => (
                  <li key={name}>
                    <Mark />
                    {name}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?topic=${item.id}`} className="text-link">
                Let’s explore your challenge
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
      ))}
      <PageCta title="What could we build together?" />
    </div>
  );
}
export function AboutPage() {
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Meet Vectramind"
        title={["With you", "in mind."]}
        description="Where magnitude meets direction. We blend intelligence, innovation and technology to transform human experiences."
        image="team.webp"
        cta="Meet our capabilities"
        href="/capabilities"
      />
      <IntroSection
        label="Our perspective"
        title="A world in motion. A purpose that stays human."
        text="There’s a constant restlessness in our world to create better and connect faster. At Vectramind, we solve problems with carefully measured magnitude and precisely dialed direction, creating impact through intelligent platforms and connected experiences."
      />
      <section className="mission-section page-padding">
        <SectionLabel>Our mission</SectionLabel>
        <div className="mission-grid">
          <article data-reveal>
            <span className="eyebrow">01 / Reinvention</span>
            <h2 className="display">Adapt.</h2>
            <p>
              Adapting to change is as natural to us as breathing. We believe
              reinvention is a constant practice in everything we do in the
              pursuit of excellence.
            </p>
          </article>
          <article data-reveal>
            <span className="eyebrow">02 / Possibility</span>
            <h2 className="display">Evolve.</h2>
            <p>
              We’re inspired by an unfolding future of connecting minds,
              integrated systems and insightful solutions, in a constant process
              of innovation and improvement.
            </p>
          </article>
        </div>
      </section>
      <section className="founder-section page-padding inner-section">
        <div className="founder-image">
          <img
            src="/images/ceo_about.webp"
            alt="Dr. Murali Krishna Vakalapudi, Founder and CEO of Vectramind"
            loading="lazy"
          />
        </div>
        <div>
          <span className="eyebrow">A message from our founder</span>
          <h2 data-reveal>
            “I invite you to experience success. I invite you to experience
            Vectramind.”
          </h2>
          <p>
            Our AI-driven technology fuels data-driven insights and seamless
            integrations, empowering our customers to keep pace with change.
            From Synapse to Firstpass, the Vectramind story has always been
            defined by evolution.
          </p>
          <strong>Dr. Murali Krishna Vakalapudi, MBBS</strong>
          <span>Founder & CEO</span>
        </div>
      </section>
      <FeatureGrid
        label="The way we work"
        title="Curious minds. Consistent purpose."
        items={[
          [
            "Intelligence",
            "We connect ideas, data and systems to create useful insights and thoughtful solutions.",
          ],
          [
            "Innovation",
            "Curiosity drives us to explore new possibilities, experiment and keep improving.",
          ],
          [
            "Human experiences",
            "We build around the people behind every interaction, journey and organization.",
          ],
        ]}
      />
      <section className="inner-section page-padding">
        <SectionLabel>Global in outlook</SectionLabel>
        <div className="inner-intro">
          <h2 className="display" data-reveal>
            Many places.
            <br />
            One direction.
          </h2>
          <div>
            <p>Our team connects perspectives across five key locations.</p>
            <div className="office-chips">
              {offices.map((office) => (
                <Link href="/contact#locations" key={office}>
                  {office}
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <People />
      <PageCta
        title="Your next chapter. Our shared future."
        text="Join curious minds who are turning big ideas into better human experiences."
        label="Explore life at Vectramind"
        href="/careers"
      />
    </div>
  );
}
export function CareersPage() {
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Careers at Vectramind"
        title={["Open minds.", "New possibilities."]}
        description="Storytellers. Pioneers. Mentors. Creators. Bring your curiosity to a team that is always finding new ways to adapt and evolve."
        image="career.webp"
        cta="Introduce yourself"
        href="/contact?topic=careers"
      />
      <IntroSection
        label="Life at Vectramind"
        title="Big ideas start with curious people."
        text="Fast-paced and future-driven. Unbridled curiosity. Mutual trust. At Vectramind, we bring together experiences and perspectives to turn ambitious ideas into reality. Growth aligns with purpose, and magnitude meets direction."
      />
      <FeatureGrid
        label="Room to grow"
        title="Build great products. Grow together."
        items={[
          [
            "Learning",
            "Stay curious, explore new ideas and build knowledge alongside your colleagues.",
          ],
          [
            "Recognition",
            "Bring your perspective to a culture that recognizes talent, contribution and collaboration.",
          ],
          [
            "Growth",
            "Develop your skills while helping shape platforms that serve people and organizations.",
          ],
          [
            "Leadership",
            "Take initiative, share your experience and help others move forward.",
          ],
        ]}
      />
      <section className="career-story page-padding inner-section">
        <div className="career-photo">
          <img
            src="/images/event-31.webp"
            alt="The Vectramind team working together"
            loading="lazy"
            data-parallax
          />
        </div>
        <div>
          <span className="eyebrow">Collaborate & work as one</span>
          <h2 className="display" data-reveal>
            A global outlook.
            <br />A human culture.
          </h2>
          <p>
            We’re an equal rights employer that encourages diversity while
            recognizing merit and growth. Our global team is connected by a
            shared belief in the possibilities ahead.
          </p>
          <Link className="text-link" href="/about">
            Meet Vectramind
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="talent-panel page-padding">
        <span className="eyebrow">Open positions for open minds</span>
        <h2 className="display" data-reveal>
          Your next move
          <br />
          could start here.
        </h2>
        <p>
          Tell us what you love building and where you want to grow. Connect
          with the team to ask about current opportunities.
        </p>
        <Link className="button button-primary" href="/contact?topic=careers">
          Start a careers conversation
          <Arrow />
        </Link>
      </section>
    </div>
  );
}
