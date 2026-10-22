"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import { Button } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  cta,
  href = "/contact",
  image,
}: {
  eyebrow: string;
  title: readonly string[];
  description: string;
  children?: ReactNode;
  cta?: string;
  href?: string;
  image?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <section
      className={`inner-hero page-padding ${image ? "inner-hero-photo" : ""}`}
      id="top"
    >
      {image && (
        <div className="inner-hero-bg">
          <img src={`/images/${image}`} alt="" data-parallax />
          <div />
        </div>
      )}
      <div className="inner-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{eyebrow}</span>
      </div>
      <div className="inner-hero-grid">
        <div>
          <span className="eyebrow inner-eyebrow">{eyebrow}</span>
          <h1 className="display">
            {title.map((line, i) => (
              <span className="inner-title-mask" key={line}>
                <motion.span
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.12,
                    ease: [0.77, 0, 0.175, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <p>{description}</p>
          {cta && (
            <Button asChild>
              <Link href={href}>
                {cta}
                <Arrow />
              </Link>
            </Button>
          )}
        </div>
        {children && <div className="inner-hero-art">{children}</div>}
      </div>
      <div className="inner-hero-bottom">
        <span>Intelligence. Innovation. Technology.</span>
        <span>With you in mind. ↓</span>
      </div>
    </section>
  );
}
export function IntroSection({
  label,
  title,
  text,
  children,
}: {
  label: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="inner-section page-padding">
      <SectionLabel>{label}</SectionLabel>
      <div className="inner-intro">
        <h2 className="display" data-reveal>
          {title}
        </h2>
        <div>
          <p data-reveal>{text}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
export function FeatureGrid({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: readonly (readonly [string, string])[];
}) {
  return (
    <section className="inner-section inner-panel page-padding">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="display inner-section-title" data-reveal>
        {title}
      </h2>
      <div className="inner-feature-grid">
        {items.map(([name, text], i) => (
          <article key={name} data-reveal>
            <span className="eyebrow">
              0{i + 1} <span>↗</span>
            </span>
            <h3>{name}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function FaqList({
  items,
  searchable = false,
}: {
  items: readonly (readonly [string, string])[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) =>
    item.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="faq-list">
      {searchable && (
        <label className="faq-search">
          <span className="eyebrow">Find an answer</span>
          <input
            type="search"
            placeholder="Search questions, products, integrations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}
      <div aria-live="polite">
        {filtered.length === 0 && (
          <p className="empty-results">
            No matching answers. Try another search or contact our team.
          </p>
        )}
        {filtered.map(([question, answer], i) => (
          <details key={question}>
            <summary>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              {question}
              <span className="faq-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
export function PageCta({
  title = "Your next chapter starts here.",
  text = "Let’s bring your goals, your people and your systems into a shared direction.",
  label = "Start a conversation",
  href = "/contact",
}: {
  title?: string;
  text?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="inner-cta page-padding">
      <span className="eyebrow">A shared direction</span>
      <h2 className="display" data-reveal>
        {title}
      </h2>
      <div>
        <p>{text}</p>
        <Button asChild>
          <Link href={href}>
            {label}
            <Arrow />
          </Link>
        </Button>
      </div>
    </section>
  );
}
