"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-notice"
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 25, opacity: 0 }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
