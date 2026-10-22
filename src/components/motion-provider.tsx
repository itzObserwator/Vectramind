"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {});
    const reveals = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          reveals.unobserve(el);
          context.add(() => {
            if (
              el.matches("h2.display") &&
              !el.querySelector(".rotating-audience")
            ) {
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 105,
                    duration: 1.2,
                    stagger: 0.13,
                    ease: "power4.inOut",
                    scrollTrigger: {
                      trigger: el,
                      start: "top 92%",
                      once: true,
                    },
                  }),
              });
              return;
            }
            gsap.fromTo(
              el,
              { y: 54, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.05,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 92%", once: true },
              },
            );
          });
        });
      },
      { rootMargin: "0px 0px 180px 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => reveals.observe(el));
    context.add(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7, scale: 1.13 },
          {
            yPercent: 7,
            scale: 1.03,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      reveals.disconnect();
      window.removeEventListener("load", refresh);
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
