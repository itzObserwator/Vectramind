"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
const Scene = dynamic(() => import("./hero-energy-scene"), { ssr: false });
// The faint secondary sweep is part of the supplied screenshot, rather than
// a temporary loading layer. Keep it behind the original Three.js ribbons.
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
  const visible = useInView(root, { margin: "80px" });
  const [reduced, setReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () =>
      setTabVisible(document.visibilityState === "visible");
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);
  useEffect(() => {
    if (visible) setReady(true);
  }, [visible]);
  return (
    <div
      ref={root}
      className="hero-signal hero-energy signal-field"
      aria-hidden="true"
    >
      <RibbonUnderlay />
      {ready && <Scene visible={visible && tabVisible} still={!!reduced} />}
    </div>
  );
}
