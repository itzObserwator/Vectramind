"use client";
import { useEffect, useState, type RefObject } from "react";
export function useViewportPresence(
  ref: RefObject<HTMLElement | null>,
  margin = "0px",
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, margin]);
  return visible;
}
