"use client";
import { LazySculpture as Sculpture } from "@/components/visuals/lazy-sculpture";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { capabilities } from "@/content/site";

import {
  Mark,
  SectionLabel,
  ContactButton,
} from "@/components/site-primitives";
function RotatingAudience() {
  const words = ["Healthcare", "Enterprises", "People", "Your future"];
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      3000,
    );
    return () => clearInterval(timer);
  }, [reduced, words.length]);
  return (
    <div className="rotating-audience">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={reduced ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
export function CapabilitySection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const trigger = ScrollTrigger.create({
          trigger: ".capability-track",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) =>
            setActive(Math.min(2, Math.floor(self.progress * 3))),
        });
        return () => trigger.kill();
      },
      root,
    );
    return () => mm.revert();
  }, []);
  function select(index: number) {
    const track = root.current?.querySelector<HTMLElement>(".capability-track");
    if (!track) return;
    if (window.innerWidth > 900 && !reduced)
      window.scrollTo({
        top:
          track.getBoundingClientRect().top +
          window.scrollY +
          (track.offsetHeight - window.innerHeight) * ((index + 0.15) / 3),
        behavior: "smooth",
      });
    else setActive(index);
  }
  return (
    <section
      id="capabilities"
      ref={root}
      className="capabilities section-space"
    >
      <div className="page-padding">
        <SectionLabel right="01 / What we make possible">
          Our capabilities
        </SectionLabel>
        <h2 className="display section-heading" data-reveal>
          Intelligent solutions.
          <br />
          Human experiences.
          <RotatingAudience />
        </h2>
      </div>
      <div className="capability-track page-padding">
        <div className="capability-sticky">
          <div className="capability-visual">
            <Sculpture
              mode={active === 0 ? "cluster" : active === 1 ? "orb" : "layers"}
              still={!!reduced}
            />
            <span className="visual-label">Magnitude meets direction.</span>
            <span className="visual-cross">+</span>
          </div>
          <div className="capability-copy">
            <div className="capability-rule">
              <span>0{active + 1}</span>
              <span>{capabilities[active].detail}</span>
            </div>
            <div className="capability-copy-window">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduced ? false : { y: 34, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.42 }}
                >
                  <h3>{capabilities[active].title}</h3>
                  <p>{capabilities[active].text}</p>
                  <ContactButton secondary>
                    Explore the possibilities
                  </ContactButton>
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              className="capability-tabs"
              role="tablist"
              aria-label="Capabilities"
            >
              {capabilities.map((item, i) => (
                <button
                  role="tab"
                  aria-selected={active === i}
                  key={item.label}
                  onClick={() => select(i)}
                  className={active === i ? "active" : ""}
                >
                  <Mark />
                  <span>{item.label}</span>
                  <span className="tab-index">0{i + 1}</span>
                  <i className="tab-progress" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
