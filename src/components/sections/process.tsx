"use client";
import { LazySculpture as Sculpture } from "@/components/visuals/lazy-sculpture";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { steps } from "@/content/site";

import {
  Mark,
  SectionLabel,
  ContactButton,
} from "@/components/site-primitives";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const root = useRef<HTMLElement>(null);
  const scrollTimeline = useRef<gsap.core.Timeline | null>(null);
  const selectionTween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = root.current;
        if (!section) return;
        selectionTween.current?.kill();
        gsap.set(section, { "--process-step": 0 });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
          onUpdate() {
            const position =
              parseFloat(section.style.getPropertyValue("--process-step")) || 0;
            setActive(
              Math.max(0, Math.min(steps.length - 1, Math.round(position))),
            );
          },
        });
        // A shared fractional step drives the title, number and description
        // reels. The holds between transitions leave each step time to read.
        timeline.fromTo(
          section,
          { "--process-orb-lift": "24vh" },
          { "--process-orb-lift": "-20vh", duration: 3 },
          0,
        );
        steps.slice(1).forEach((_, index) => {
          timeline.to(
            section,
            { "--process-step": index + 1, duration: 0.42 },
            index + 0.72,
          );
        });
        scrollTimeline.current = timeline;
        return () => {
          scrollTimeline.current = null;
          section.style.removeProperty("--process-step");
          section.style.removeProperty("--process-orb-lift");
          setActive(0);
        };
      },
      root,
    );
    return () => {
      preference.removeEventListener("change", syncPreference);
      selectionTween.current?.kill();
      mm.revert();
    };
  }, []);
  return (
    <section id="how-we-start" className="process-track" ref={root}>
      <div className="process-sticky page-padding">
        <SectionLabel right="03 / A shared direction">
          How we start
        </SectionLabel>
        <p className="process-intro">
          Ready to transform your customer experience?
          <br />
          Let’s start with what’s possible.
        </p>
        <div className="process-stage">
          <div className="process-orb">
            <Sculpture still={!!reduced} />
          </div>
          <div className="process-heading">
            <h2 className="sr-only">
              {steps[active].title} — Step 0{active + 1}
            </h2>
            <div className="process-title-window display" aria-hidden="true">
              <div className="process-title-reel">
                {steps.map((step) => (
                  <span key={step.title}>{step.title}</span>
                ))}
              </div>
            </div>
            <div className="process-step-label display" aria-hidden="true">
              <span>Step 0</span>
              <span className="process-digit-window">
                <span className="process-digit-reel">
                  {steps.map((step, index) => (
                    <span key={step.title}>{index + 1}</span>
                  ))}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="process-selectors">
          {steps.map((step, i) => (
            <button
              aria-pressed={i === active}
              key={step.title}
              className={i === active ? "active" : ""}
              onClick={() => {
                const trigger = scrollTimeline.current?.scrollTrigger;
                if (trigger)
                  window.scrollTo({
                    top:
                      trigger.start +
                      (trigger.end - trigger.start) *
                        ((i + 0.5) / steps.length),
                    behavior: "smooth",
                  });
                else {
                  setActive(i);
                  if (reduced) {
                    selectionTween.current?.kill();
                    gsap.set(root.current, { "--process-step": i });
                  } else {
                    selectionTween.current = gsap.to(root.current, {
                      "--process-step": i,
                      duration: 0.45,
                      ease: "power2.inOut",
                      overwrite: "auto",
                    });
                  }
                }
              }}
            >
              0{i + 1}
              <span>{step.title}</span>
            </button>
          ))}
        </div>
        <div className="process-caption">
          <Mark />
          <div className="process-caption-copy">
            <p className="sr-only" aria-live="polite">
              {steps[active].text}
            </p>
            <div className="process-caption-window" aria-hidden="true">
              <div className="process-description-reel">
                {steps.map((step) => (
                  <p key={step.title}>{step.text}</p>
                ))}
              </div>
            </div>
          </div>
          <ContactButton>Let’s get started</ContactButton>
        </div>
      </div>
    </section>
  );
}
