import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function mount(root: RefObject<HTMLElement | null>) {
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
}
