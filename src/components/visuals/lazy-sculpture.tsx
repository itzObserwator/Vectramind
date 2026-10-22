"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Scene = dynamic(() => import("./sculpture"), {
  ssr: false,
  loading: () => <div className="orb-fallback" />,
});

// Splitting a chunk alone still loads it on mount. Wait until the scene is
// near the viewport before downloading Three.js or creating a WebGL context.
export function LazySculpture({
  mode = "orb",
  still = false,
}: {
  mode?: "orb" | "layers" | "cluster";
  still?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className="sculpture" aria-hidden="true">
      {ready ? (
        <Scene mode={mode} still={still} />
      ) : (
        <div className="orb-fallback" />
      )}
    </div>
  );
}
