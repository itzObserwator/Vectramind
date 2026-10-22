"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/site-primitives";
import { platformCards } from "@/content/platforms";
import { PlatformPreview } from "./platform-preview";

gsap.registerPlugin(ScrollTrigger);

export function OurPlatforms() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 901px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const section = root.current;
        if (!section || !context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: desktop ? "top top" : "top 72%",
            end: desktop ? "bottom bottom" : "+=700",
            scrub: desktop ? 0.6 : undefined,
            toggleActions: desktop ? undefined : "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
        // Reference 23.1–25.7s: left image leads the right image; bottom slivers
        // unfold upward, then metadata lands in separate, staggered passes.
        section
          .querySelectorAll<HTMLElement>(".experience-work-card")
          .forEach((card, index) => {
            const lead = index * 0.08;
            timeline.fromTo(
              card.querySelector(".platform-image-link"),
              {
                y: () => (desktop ? Math.min(innerHeight * 0.33, 300) : 100),
                clipPath: "inset(99% 0% 0% 0% round 12px)",
              },
              {
                y: 0,
                clipPath: "inset(0% 0% 0% 0% round 12px)",
                duration: 0.34,
                ease: "power2.out",
              },
              lead,
            );
            timeline.fromTo(
              card.querySelectorAll(".platform-category"),
              { y: 48, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.15,
                stagger: 0.035,
                ease: "power2.out",
              },
              0.32 + lead,
            );
            timeline.fromTo(
              card.querySelector("h3"),
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.17, ease: "power2.out" },
              0.48 + lead,
            );
            timeline.fromTo(
              card.querySelector(".platform-card-description"),
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" },
              0.56 + lead,
            );
            timeline.fromTo(
              card.querySelector(".platform-card-cta"),
              { y: 12, clipPath: "inset(0% 100% 0% 0% round 30px)" },
              {
                y: 0,
                clipPath: "inset(0% 0% 0% 0% round 30px)",
                duration: 0.15,
                ease: "power2.out",
              },
              0.66 + lead,
            );
          });
        timeline.to({}, { duration: 0.11 }, 0.89);
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section
      id="products"
      className="experience-work reference-platforms"
      ref={root}
      aria-labelledby="platforms-title"
    >
      <div className="platforms-sticky">
        <header className="platforms-section-label">
          <span>03 / Built around you</span>
          <h2 id="platforms-title">Our platforms</h2>
        </header>
        <div className="experience-work-grid platforms-grid">
          {platformCards.map((platform) => (
            <article
              className="experience-work-card platform-card"
              key={platform.slug}
            >
              <Link
                href={platform.href}
                className={`platform-image-link work-${platform.slug}`}
                aria-label={`Explore ${platform.name}`}
              >
                <PlatformPreview platform={platform.slug} />
                <span className="platform-preview-cursor" aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <div className="platform-card-tags">
                {platform.tags.map((tag) => (
                  <span className="platform-category" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3>{platform.title}</h3>
              <p className="platform-card-description">
                {platform.description}
              </p>
              <Link href={platform.href} className="platform-card-cta">
                Explore {platform.name} <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
