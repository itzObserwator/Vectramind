"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import trails from "./hero-trail-paths.json";
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
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={i}
          d={`M -100 ${-80 + i * 9} C 250 ${50 + i * 8}, 400 ${640 - i * 6}, 600 390 S 1000 ${120 + i * 5}, 1300 ${i * 10 - 30}`}
          fill="none"
          stroke={i % 4 === 0 ? "#afafaf" : "#c6c6c6"}
          strokeOpacity=".14"
          strokeWidth={i % 4 === 0 ? 2 : 1}
        />
      ))}
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
        {trails.map((trail, index) => (
          <path
            key={index}
            d={trail.d}
            stroke={index % 5 === 0 ? "#979797" : "#b8b8b8"}
            strokeWidth={trail.width}
            opacity={index % 5 === 0 ? 0.3 : 0.14}
          />
        ))}
        {trails
          .filter((trail) => trail.left)
          .flatMap((trail, index) =>
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
