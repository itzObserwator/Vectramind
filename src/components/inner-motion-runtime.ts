import {
  innerRevealTargets,
  shouldRevealInnerElement,
} from "./inner-page-reveals";

// Inner pages need scroll reveals, not the landing page's timeline engine.
// Native animations leave the main thread idle between scrolls and reveals.
export function mountInnerMotion(root: HTMLElement) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let teardown: (() => void) | undefined;
  const setup = () => {
    teardown?.();
    teardown = undefined;
    if (media.matches) return;
    const registered = new Map<
      HTMLElement,
      { opacity: string; translate: string }
    >();
    const animations = new Map<HTMLElement, Animation>();
    const seen = new WeakSet<HTMLElement>();
    const restore = (element: HTMLElement) => {
      const original = registered.get(element);
      if (!original) return;
      element.style.opacity = original.opacity;
      element.style.translate = original.translate;
    };
    const finish = (element: HTMLElement) => {
      animations.get(element)?.cancel();
      animations.delete(element);
      restore(element);
      element.dataset.scrollReveal = "complete";
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          element.dataset.scrollReveal = "revealing";
          const animation = element.animate(
            [
              { opacity: 0, translate: element.style.translate },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 750,
              delay: (index % 4) * 45,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "both",
            },
          );
          animations.set(element, animation);
          animation.onfinish = () => finish(element);
        });
      },
      { rootMargin: "0px 0px -35px 0px" },
    );
    const register = () => {
      // Batch geometry reads before hiding anything. Content already in view
      // remains painted; hydration must never hide the page's LCP heading.
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(innerRevealTargets),
      )
        .filter(
          (element) =>
            !seen.has(element) &&
            !element.closest('[aria-hidden="true"],.sr-only'),
        )
        .map((element) => ({
          element,
          top: element.getBoundingClientRect().top,
        }));
      for (const { element, top } of elements) {
        if (!shouldRevealInnerElement(element)) continue;
        seen.add(element);
        registered.set(element, {
          opacity: element.style.opacity,
          translate: element.style.translate,
        });
        if (top < innerHeight - 35) {
          element.dataset.scrollReveal = "complete";
          continue;
        }
        element.dataset.scrollReveal = "pending";
        element.style.opacity = "0";
        element.style.translate = element.matches("a,button,label,summary")
          ? "0 0"
          : "0 24px";
        observer.observe(element);
      }
    };
    register();
    let registerFrame = 0;
    const additions = new MutationObserver(() => {
      if (!registerFrame)
        registerFrame = requestAnimationFrame(() => {
          registerFrame = 0;
          register();
        });
    });
    additions.observe(root, { childList: true, subtree: true });
    let pointerFocus = false;
    const markPointer = () => {
      pointerFocus = true;
    };
    const clearPointer = () => {
      pointerFocus = false;
    };
    const focus = (event: FocusEvent) => {
      // A pointer click must not move its target between down and up.
      if (pointerFocus) return;
      const element = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-scroll-reveal="pending"],[data-scroll-reveal="revealing"]',
      );
      if (element && root.contains(element)) {
        observer.unobserve(element);
        finish(element);
      }
    };
    root.addEventListener("focusin", focus);
    root.addEventListener("pointerdown", markPointer, true);
    root.addEventListener("keydown", clearPointer, true);
    window.addEventListener("pointerup", clearPointer, true);
    window.addEventListener("pointercancel", clearPointer, true);

    // Parallax photos also update only on scroll, with no permanent RAF loop.
    const photos = Array.from(
      root.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const transforms = photos.map((photo) => photo.style.transform);
    let scrollFrame = 0;
    const updatePhotos = () => {
      scrollFrame = 0;
      const positions = photos.map((photo) =>
        photo.parentElement!.getBoundingClientRect(),
      );
      photos.forEach((photo, index) => {
        const box = positions[index];
        if (box.bottom < 0 || box.top > innerHeight) return;
        const progress = Math.max(
          0,
          Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)),
        );
        photo.style.transform = `translateY(${-7 + progress * 14}%) scale(${1.13 - progress * 0.1})`;
      });
    };
    const scroll = () => {
      if (photos.length && !scrollFrame)
        scrollFrame = requestAnimationFrame(updatePhotos);
    };
    updatePhotos();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    teardown = () => {
      observer.disconnect();
      additions.disconnect();
      cancelAnimationFrame(registerFrame);
      cancelAnimationFrame(scrollFrame);
      animations.forEach((animation) => animation.cancel());
      registered.forEach((_, element) => {
        restore(element);
        delete element.dataset.scrollReveal;
      });
      photos.forEach(
        (photo, index) => (photo.style.transform = transforms[index]),
      );
      root.removeEventListener("focusin", focus);
      root.removeEventListener("pointerdown", markPointer, true);
      root.removeEventListener("keydown", clearPointer, true);
      window.removeEventListener("pointerup", clearPointer, true);
      window.removeEventListener("pointercancel", clearPointer, true);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  };
  setup();
  media.addEventListener("change", setup);
  return () => {
    teardown?.();
    media.removeEventListener("change", setup);
  };
}
