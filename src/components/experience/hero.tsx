"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Arrow, ContactButton } from "@/components/site-primitives";
import { HeroEnergy } from "@/components/visuals/hero-energy";
import { experience } from "@/content/experience";

export function ExperienceHero() {
  const reduced = useReducedMotion();
  return (
    <section
      id="top"
      className="experience-hero"
      aria-label="Vectramind introduction"
    >
      <HeroEnergy />
      <div className="experience-hero-content">
        <motion.p
          className="experience-kicker"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span />
          {experience.hero.eyebrow}
        </motion.p>
        <h1 aria-label="Vectramind — Transforming human experiences">
          {experience.hero.title.map((line, i) => (
            <span className="experience-title-mask" key={line}>
              <motion.span
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.08 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="experience-hero-description"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {experience.hero.description}
        </motion.p>
        <motion.div
          className="experience-hero-actions"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <ContactButton>Let’s build what’s next</ContactButton>
          <Link href="#products" className="experience-quiet-link">
            Explore our platforms <Arrow />
          </Link>
        </motion.div>
      </div>
      <div className="experience-hero-foot">
        <div className="experience-pillars">
          {experience.hero.pillars.map((item) => (
            <span key={item}>
              <i />
              {item}
            </span>
          ))}
        </div>
        <a className="experience-scroll" href="#introduction">
          <span>Scroll to connect</span>
          <span aria-hidden="true">↓</span>
        </a>
        <p>Built for people. Ready for possibility.</p>
      </div>
    </section>
  );
}
