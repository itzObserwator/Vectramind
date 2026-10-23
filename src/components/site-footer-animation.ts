import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function mount(root: RefObject<HTMLElement | null>) {
  const media = gsap.matchMedia();
  media.add(
    "(prefers-reduced-motion: no-preference)",
    () => {
      const section = root.current;
      if (!section) return;
      const select = gsap.utils.selector(section);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      timeline
        .fromTo(
          select(".footer-contact-heading"),
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" },
          0,
        )
        .fromTo(
          select(".footer-contact"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.13,
            ease: "power3.out",
          },
          0.15,
        )
        .fromTo(
          select(".footer-flow"),
          { yPercent: 18, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.4, ease: "power2.out" },
          0.1,
        )
        .fromTo(
          select(".footer-reference-lower, .footer-reference-legal"),
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.55,
        );
    },
    root,
  );
  return () => media.revert();
}
