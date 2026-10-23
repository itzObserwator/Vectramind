"use client";
import { useEffect, useRef } from "react";
type Cleanup = void | (() => void);
// Keep readable HTML in the initial response; download animation code only
// when its section approaches. Never run a late import after unmounting.
export function useDeferredAnimation(
  ready: boolean,
  load: () => Promise<() => Cleanup>,
) {
  const loader = useRef(load);
  loader.current = load;
  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    let cleanup: Cleanup;
    loader.current().then((initialize) => {
      if (!disposed) cleanup = initialize();
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ready]);
}
