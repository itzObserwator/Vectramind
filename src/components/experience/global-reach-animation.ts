import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function mount(root: RefObject<HTMLElement | null>) {
  const media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 901px) and (min-height: 851px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const section = root.current;
      if (!section || !context.conditions?.motion) return;
      const select = gsap.utils.selector(section);
      const desktop = context.conditions.desktop;
      const count = { value: 0 };
      const number = section.querySelector(".reach-client-count");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: desktop ? "top top" : "top 65%",
          end: desktop ? "bottom bottom" : "+=850",
          scrub: desktop ? 0.7 : undefined,
          toggleActions: desktop ? undefined : "play none none reverse",
        },
      });
      timeline.fromTo(
        select(".reach-globe-scene"),
        { y: 40, scale: 1.06, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.43, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        select(".reach-copy h2, .reach-copy p, .reach-copy > a"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.23,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.1,
      );
      timeline.fromTo(
        select(".reach-highlight"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
        0.19,
      );
      timeline.fromTo(
        count,
        { value: 0 },
        {
          value: 800,
          duration: 0.36,
          ease: "power2.out",
          onUpdate: () => {
            if (number) number.textContent = `${Math.round(count.value)}+`;
          },
        },
        0.2,
      );
      timeline.fromTo(
        select(".reach-metric"),
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, stagger: 0.06 },
        0.42,
      );
      timeline.fromTo(
        select(".reach-offices"),
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        0.55,
      );
      timeline.to({}, { duration: 0.19 }, 0.81);
      return () => {
        if (number) number.textContent = "800+";
      };
    },
    root,
  );
  return () => media.revert();
}
