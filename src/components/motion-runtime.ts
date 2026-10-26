import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

import {
  innerRevealTargets,
  shouldRevealInnerElement,
} from "./inner-page-reveals";

export function mountMotion() {
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    // CSS overflow alone cannot stop an in-flight smooth-scroll animation.
    // Keep the menu's native scrolling independent of the page scroll engine.
    const syncNavigation = () => {
      if (document.body.hasAttribute("data-navigation-open")) lenis.stop();
      else lenis.start();
    };
    const navigation = new MutationObserver(syncNavigation);
    navigation.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-navigation-open"],
    });
    syncNavigation();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {});
    const seen = new WeakSet<Element>();
    const inner = document.querySelector(".inner-page, .not-found-page");
    const registered = new Set<HTMLElement>();
    const reveals = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          reveals.unobserve(el);
          context.add(() => {
            if (inner?.contains(el)) {
              el.dataset.scrollReveal = "revealing";
              gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: (index % 4) * 0.045,
                ease: "power3.out",
                onComplete: () => {
                  el.dataset.scrollReveal = "complete";
                },
              });
            } else if (
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
            } else {
              gsap.fromTo(
                el,
                { y: 54, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1.05,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                    once: true,
                  },
                },
              );
            }
          });
        });
      },
      { rootMargin: inner ? "0px 0px -35px 0px" : "0px 0px 180px 0px" },
    );
    const registerInner = () => {
      inner?.querySelectorAll<HTMLElement>(innerRevealTargets).forEach((el) => {
        if (seen.has(el) || !shouldRevealInnerElement(el)) return;
        seen.add(el);
        registered.add(el);
        el.dataset.scrollReveal = "pending";
        const offset = el.matches("a, button, label, summary") ? 0 : 24;
        context.add(() => gsap.set(el, { y: offset, opacity: 0 }));
        reveals.observe(el);
      });
    };
    registerInner();
    // Keyboard navigation can reach content before a scroll observer fires.
    // Bring that target into view immediately without delaying interaction.
    let pointerFocus = false;
    const markPointerFocus = () => {
      pointerFocus = true;
    };
    const clearPointerFocus = () => {
      pointerFocus = false;
    };
    const revealFocused = (event: FocusEvent) => {
      // Moving a button between pointer-down and pointer-up can cancel its
      // click. The instant reveal is for keyboard/programmatic focus only.
      if (pointerFocus) return;
      const element = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-scroll-reveal="pending"], [data-scroll-reveal="revealing"]',
      );
      if (!element || !inner?.contains(element)) return;
      reveals.unobserve(element);
      gsap.killTweensOf(element);
      context.add(() => gsap.set(element, { y: 0, opacity: 1 }));
      element.dataset.scrollReveal = "complete";
    };
    inner?.addEventListener("focusin", revealFocused as EventListener);
    inner?.addEventListener("pointerdown", markPointerFocus, true);
    inner?.addEventListener("keydown", clearPointerFocus, true);
    window.addEventListener("pointerup", clearPointerFocus, true);
    window.addEventListener("pointercancel", clearPointerFocus, true);
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (!inner?.contains(el)) reveals.observe(el);
    });
    let registerFrame = 0;
    const additions = new MutationObserver(() => {
      cancelAnimationFrame(registerFrame);
      registerFrame = requestAnimationFrame(registerInner);
    });
    if (inner) additions.observe(inner, { childList: true, subtree: true });
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
    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      disposed = true;
      reveals.disconnect();
      inner?.removeEventListener("focusin", revealFocused as EventListener);
      inner?.removeEventListener("pointerdown", markPointerFocus, true);
      inner?.removeEventListener("keydown", clearPointerFocus, true);
      window.removeEventListener("pointerup", clearPointerFocus, true);
      window.removeEventListener("pointercancel", clearPointerFocus, true);
      additions.disconnect();
      cancelAnimationFrame(registerFrame);
      window.removeEventListener("load", refresh);
      context.revert();
      registered.forEach((el) => delete el.dataset.scrollReveal);
      gsap.ticker.remove(tick);
      navigation.disconnect();
      lenis.destroy();
    };
  });
  return () => media.revert();
}
