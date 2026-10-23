"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      setVisible(!localStorage.getItem("vectramind-notice"));
    } catch {
      setVisible(true);
    }
  }, []);
  return (
    <>
      {visible && (
        <div className="cookie-notice">
          <span>Your preferences stay on this device.</span>
          <button
            onClick={() => {
              try {
                localStorage.setItem("vectramind-notice", "dismissed");
              } catch {}
              setVisible(false);
            }}
          >
            Got it
          </button>
        </div>
      )}
    </>
  );
}
