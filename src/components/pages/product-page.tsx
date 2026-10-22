"use client";
import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { products, type ProductKey } from "@/content/products";
import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
import {
  PageHero,
  IntroSection,
  FeatureGrid,
  FaqList,
  PageCta,
} from "./page-primitives";
import { CaseStudies } from "@/components/sections/case-studies";

function ProductArt({ product }: { product: ProductKey }) {
  return (
    <div className={`product-art product-art-${product}`}>
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <Mark className="art-mark" />
      <div className="product-art-card">
        <div className="art-card-top">
          <img
            src={`/images/${product}.svg`}
            alt={products[product].name}
            width="130"
            height="40"
          />
          <span className="connection-dot">Connected</span>
        </div>
        {product === "synapse" ? (
          <>
            <div className="message-bubble">
              <span>Every conversation begins with a connection.</span>
              <small>Customer engagement</small>
            </div>
            <div className="message-bubble reply">
              <span>Make it a meaningful one.</span>
              <HugeiconsIcon icon={Message01Icon} size={22} />
            </div>
            <div className="art-channel-tags">
              <span>SMS</span>
              <span>WhatsApp</span>
              <span>Email</span>
              <span>RCS</span>
            </div>
          </>
        ) : (
          <>
            <div className="appointment-preview">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={36}
                strokeWidth={1.2}
              />
              <h3>
                A smoother journey.
                <br />
                At every step.
              </h3>
            </div>
            <div className="patient-path">
              <span>Schedule</span>
              <i />
              <span>Check in</span>
              <i />
              <span>Care</span>
            </div>
          </>
        )}
        <div className="art-card-bottom">
          <span>Human experiences, connected.</span>
          <Arrow />
        </div>
      </div>
      <span className="art-caption">
        An illustration of connected possibilities
      </span>
    </div>
  );
}
export function ProductPage({ product }: { product: ProductKey }) {
  const data = products[product];
  const [moduleIndex, setModuleIndex] = useState(0);
  return (
    <div className={`inner-page product-page ${product}-page`}>
      <PageHero
        eyebrow={data.category}
        title={data.headline}
        description={data.description}
        cta={`Request a ${data.name} demo`}
        href={`/contact?topic=${product}`}
      >
        <ProductArt product={product} />
      </PageHero>
      <section
        className="product-metrics page-padding"
        aria-label={`${data.name} at a glance`}
      >
        {data.metrics.map(([value, label]) => (
          <div key={label}>
            <strong className="display">{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <IntroSection
        label={`Meet ${data.name}`}
        title={data.intro}
        text={data.introText}
      >
        <Link className="text-link" href="#platform-features">
          Explore the platform
          <Arrow />
        </Link>
      </IntroSection>
      <div id="platform-features">
        <FeatureGrid
          label={
            product === "firstpass"
              ? "Four connected pillars"
              : "Built for meaningful engagement"
          }
          title={
            product === "firstpass"
              ? "A better experience. For everyone."
              : "Your conversations. Without the complexity."
          }
          items={data.features}
        />
      </div>
      <section className="inner-section page-padding">
        <SectionLabel>
          {product === "firstpass"
            ? "A connected suite"
            : "Your conversational ecosystem"}
        </SectionLabel>
        <div className="module-layout">
          <div>
            <h2 className="display inner-section-title" data-reveal>
              {product === "firstpass"
                ? "One journey. Every touchpoint."
                : "Many channels. One connection."}
            </h2>
            <p className="section-description">
              {product === "firstpass"
                ? "Explore nine modules designed to work powerfully on their own and seamlessly together."
                : "Meet your customers where they are, with channels that work as part of a shared engagement strategy."}
            </p>
            <div
              className="module-buttons"
              role="tablist"
              aria-label={`${data.name} ${product === "firstpass" ? "modules" : "channels"}`}
            >
              {data.modules.map(([name], i) => (
                <button
                  key={name}
                  id={`module-tab-${i}`}
                  role="tab"
                  aria-selected={moduleIndex === i}
                  aria-controls="module-panel"
                  tabIndex={moduleIndex === i ? 0 : -1}
                  onClick={() => setModuleIndex(i)}
                  onKeyDown={(e) => {
                    if (
                      [
                        "ArrowRight",
                        "ArrowDown",
                        "ArrowLeft",
                        "ArrowUp",
                        "Home",
                        "End",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? data.modules.length - 1
                            : (i +
                                (e.key === "ArrowRight" || e.key === "ArrowDown"
                                  ? 1
                                  : -1) +
                                data.modules.length) %
                              data.modules.length;
                      setModuleIndex(next);
                      document.getElementById(`module-tab-${next}`)?.focus();
                    }
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div
            className="module-panel"
            id="module-panel"
            role="tabpanel"
            aria-labelledby={`module-tab-${moduleIndex}`}
            tabIndex={0}
          >
            <span className="module-numeral display" aria-hidden="true">
              {String(moduleIndex + 1).padStart(2, "0")}
            </span>
            <Mark />
            <h3>{data.modules[moduleIndex][0]}</h3>
            <p>{data.modules[moduleIndex][1]}</p>
            <Link href={`/contact?topic=${product}`} className="text-link">
              Explore with our team
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
      {product === "synapse" && <CaseStudies />}
      <section className="inner-section page-padding faq-section">
        <SectionLabel>A little more clarity</SectionLabel>
        <div className="faq-layout">
          <h2 className="display inner-section-title" data-reveal>
            Your questions.
            <br />
            Answered.
          </h2>
          <FaqList items={data.faqs} />
        </div>
      </section>
      <section className="related-platform page-padding">
        <span className="eyebrow">Explore more of Vectramind</span>
        <Link href={product === "synapse" ? "/firstpass" : "/synapse"}>
          <span>
            {product === "synapse"
              ? "Better patient journeys with Firstpass."
              : "Meaningful customer conversations with Synapse."}
          </span>
          <Arrow />
        </Link>
      </section>
      <PageCta
        title={
          product === "synapse"
            ? "Make your next conversation count."
            : "Put people first. At every step."
        }
        label={`Let’s talk ${data.name}`}
        href={`/contact?topic=${product}`}
      />
    </div>
  );
}
