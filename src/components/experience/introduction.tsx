"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { ContactButton } from "@/components/site-primitives";
import { experience } from "@/content/experience";

gsap.registerPlugin(ScrollTrigger);
export function ExperienceIntroduction() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
        stacked: "(max-width: 600px)",
      },
      (context) => {
        const section = root.current;
        const graphic =
          section?.querySelector<HTMLElement>(".post-hero-graphic");
        if (!section || !graphic) return;
        if (context.conditions?.reduced) {
          graphic.dataset.animationPhase = "static";
          return () => {
            graphic.dataset.animationPhase = "idle";
          };
        }
        // On desktop the heading and illustration share one entrance clock.
        // Start with the illustration's center in view, rather than playing the
        // result below the fold. Stacked mobile copy enters independently.
        const copy = gsap
          .timeline({ paused: true })
          .fromTo(
            section.querySelectorAll(".post-hero-question-line"),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.65, stagger: 0.18, ease: "power3.out" },
            0,
          )
          .fromTo(
            section.querySelector(".post-hero-description"),
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
            0.72,
          );
        const scene = gsap.timeline({
          scrollTrigger: { trigger: graphic, start: "center 78%", once: true },
          onStart() {
            graphic.dataset.animationPhase = "playing";
          },
          onComplete() {
            graphic.dataset.animationPhase = "complete";
          },
        });
        if (context.conditions?.stacked) {
          ScrollTrigger.create({
            trigger: section.querySelector(".post-hero-copy"),
            start: "top 72%",
            once: true,
            onEnter: () => copy.play(),
          });
        } else {
          scene.add(copy.paused(false), 0);
        }
        scene
          .fromTo(
            graphic.querySelector(".post-hero-connections"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.6 },
            0,
          )
          .fromTo(
            graphic.querySelector(".post-hero-progress"),
            { autoAlpha: 0, height: "48%" },
            { autoAlpha: 1, height: "72%", duration: 1.05, ease: "power2.out" },
            0.04,
          )
          .fromTo(
            graphic.querySelector(".post-hero-column-left"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.6 },
            0.12,
          )
          .fromTo(
            graphic.querySelector(".post-hero-column-right"),
            { height: "12%", autoAlpha: 0 },
            { height: "37%", autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            0.08,
          )
          .fromTo(
            graphic.querySelector(".post-hero-card-patient"),
            { autoAlpha: 0, y: 10, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
            0.4,
          )
          .fromTo(
            graphic.querySelector(".post-hero-card-message"),
            { autoAlpha: 0, y: 10, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
            0.64,
          )
          .fromTo(
            graphic.querySelector(".post-hero-outcome"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.35 },
            0.88,
          )
          .fromTo(
            graphic.querySelector(".post-hero-tens-reel"),
            { yPercent: 0, y: "0em" },
            { y: "-1em", duration: 1.8, ease: "power2.inOut" },
            1.12,
          )
          .fromTo(
            graphic.querySelector(".post-hero-ones-reel"),
            { yPercent: 0, y: "0em" },
            { y: "-10em", duration: 1.8, ease: "power2.out" },
            1.12,
          )
          .fromTo(
            graphic.querySelector(".post-hero-outcome-fill"),
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 1.8,
              ease: "power2.out",
            },
            1.12,
          );
        gsap.fromTo(
          section.querySelector(".post-hero-resolution"),
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section.querySelector(".post-hero-resolution"),
              start: "top 94%",
              once: true,
            },
          },
        );
        return () => {
          graphic.dataset.animationPhase = "idle";
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  return (
    <section
      id="introduction"
      className="post-hero-intro experience-padding"
      ref={root}
      aria-labelledby="post-hero-title"
    >
      <div className="post-hero-layout">
        <div className="post-hero-copy">
          <p className="post-hero-eyebrow">{experience.introduction.label}</p>
          <h2 id="post-hero-title">
            {experience.introduction.title.split("\n").map((line) => (
              <span className="post-hero-question-mask" key={line}>
                <span className="post-hero-question-line">{line}</span>
              </span>
            ))}
          </h2>
          <p className="post-hero-description">
            {experience.introduction.text}
          </p>
        </div>
        <div
          className="post-hero-graphic"
          role="group"
          aria-label="Conversations, patient journeys and systems becoming one connected experience"
        >
          <svg
            className="post-hero-connections"
            viewBox="0 0 520 450"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              className="post-hero-connect-line"
              cx="275"
              cy="215"
              rx="145"
              ry="166"
              pathLength="1"
              stroke="#d1d3d8"
            />
          </svg>
          <div
            className="post-hero-column post-hero-column-left"
            aria-hidden="true"
          >
            <span className="post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-left" />
          </div>
          <div
            className="post-hero-column post-hero-progress"
            aria-hidden="true"
          >
            <span className="post-hero-progress-fill post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-top" />
          </div>
          <div
            className="post-hero-column post-hero-column-right"
            aria-hidden="true"
          >
            <span className="post-hero-column-shaft" />
            <span className="post-hero-node post-hero-node-right" />
          </div>
          <div className="post-hero-card post-hero-card-message">
            <span className="post-hero-card-icon">
              <HugeiconsIcon icon={Message01Icon} size={17} strokeWidth={1.4} />
            </span>
            <span>
              Conversations
              <br />
              <strong>connected.</strong>
            </span>
          </div>
          <div className="post-hero-card post-hero-card-patient">
            <span className="post-hero-card-icon">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={17}
                strokeWidth={1.4}
              />
            </span>
            <span>
              Patient journeys
              <br />
              <strong>simplified.</strong>
            </span>
          </div>
          <div className="post-hero-outcome">
            <span className="sr-only">
              10% reduction in appointment no-shows in a published Synapse
              hospital case.
            </span>
            <div className="post-hero-outcome-value" aria-hidden="true">
              <span className="post-hero-digit-mask">
                <span className="post-hero-tens-reel">
                  <span>0</span>
                  <span>1</span>
                </span>
              </span>
              <span className="post-hero-digit-mask">
                <span className="post-hero-ones-reel">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, index) => (
                    <span key={index}>{digit}</span>
                  ))}
                </span>
              </span>
              <span className="post-hero-percent">%</span>
            </div>
            <span className="post-hero-outcome-track" aria-hidden="true">
              <span className="post-hero-outcome-fill" />
            </span>
            <p>fewer appointment no-shows</p>
            <Link href="/synapse">Published hospital case ↗</Link>
          </div>
          <span className="post-hero-graphic-caption">
            One connected experience.
          </span>
        </div>
      </div>
      <div className="post-hero-resolution">
        <p>Together, we can change that.</p>
        <ContactButton>Let’s connect the dots</ContactButton>
      </div>
    </section>
  );
}
