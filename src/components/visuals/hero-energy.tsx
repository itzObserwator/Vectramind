"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import trails from "./hero-pulse-paths.json";
import {
  trailPulseColors,
  trailPulseDelay,
  trailPulseDuration,
  trailPulseLength,
  trailPulseOpacity,
} from "./trail-pulses";

function RibbonUnderlay() {
  return (
    <svg
      className="hero-ribbon-underlay"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <image
        href="/images/hero-ribbon-underlay.svg"
        width="1200"
        height="700"
      />
    </svg>
  );
}
export function HeroEnergy() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const sync = () => {
      element.dataset.active = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div
      ref={root}
      className="hero-signal hero-energy signal-field"
      aria-hidden="true"
      data-active="false"
    >
      <RibbonUnderlay />
      <svg className="hero-ribbon-main" viewBox="0 0 1000 1000" fill="none">
        <image
          href="/images/hero-ribbon-base.svg"
          x="-1000"
          y="-500"
          width="3000"
          height="2000"
        />
        {trails.flatMap((trail, index) =>
          [trail.left, trail.right].map((d, side) => (
            <path
              key={`${index}-${side}`}
              className="hero-trail-pulse"
              d={d}
              pathLength="1"
              stroke={trailPulseColors[index % 4]}
              strokeWidth={trail.width}
              strokeLinecap="round"
              strokeDasharray={`${trailPulseLength * 2} ${1 - trailPulseLength * 2}`}
              opacity={trailPulseOpacity}
              style={
                {
                  "--hero-pulse-duration": `${trailPulseDuration(index) / 2}s`,
                  "--hero-pulse-delay": `${trailPulseDelay(index) - 1.6}s`,
                } as CSSProperties
              }
            />
          )),
        )}
      </svg>
    </div>
  );
}
