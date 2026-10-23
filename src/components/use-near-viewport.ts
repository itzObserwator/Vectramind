"use client";
import { useEffect, useState, type RefObject } from "react";
// Initialise expensive decorative artwork shortly before its section is visible.
// Section headings, copy and controls remain server-rendered and usable.
export function useNearViewport(
  ref: RefObject<HTMLElement | null>,
  margin = "600px",
) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current || ready) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: margin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, ready, margin]);
  return ready;
}
