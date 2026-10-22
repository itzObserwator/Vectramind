"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";

export function Hero() {
  preload("/images/hero-poster.webp", { as: "image", fetchPriority: "high" });
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const syncPlayback = () => {
      const element = video.current;
      if (!element) return;
      const heroHeight =
        element.closest("section")?.offsetHeight || window.innerHeight;
      if (
        !reduced &&
        document.visibilityState === "visible" &&
        window.scrollY < heroHeight
      ) {
        void element.play().catch(() => {});
      } else {
        element.pause();
      }
    };

    syncPlayback();
    window.addEventListener("scroll", syncPlayback, { passive: true });
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      window.removeEventListener("scroll", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [reduced]);

  return (
    <section id="top" className="hero" aria-label="Vectramind introduction">
      <h1 className="sr-only">Vectramind — Transforming human experiences</h1>
      <div className="hero-image">
        <video
          ref={video}
          src="/videos/vectramind-hero.mp4"
          poster="/images/hero-poster.webp"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
