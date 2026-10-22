"use client";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { clientLogos } from "@/content/site";

// A compact, flat logo belt like the video's transition out of the hero.
const stripLogos = [
  "SAP",
  "HSBC",
  "Mediclinic",
  "M42",
  "Citibank",
  "Standard Chartered",
].map((name) => clientLogos.find((client) => client.name === name)!);
export function ClientStrip() {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { margin: "80px" });
  const [paused, setPaused] = useState(false);
  return (
    <section
      ref={root}
      className="post-hero-client-strip"
      aria-label="Trusted by organizations worldwide"
      data-paused={paused || !visible}
    >
      <p>In good company.</p>
      <div
        id="intro-client-belt"
        className="post-hero-logo-window"
        role="region"
        aria-label="Selected Vectramind clients"
        tabIndex={0}
      >
        <div className="post-hero-logo-belt">
          {[false, true].map((duplicate) => (
            <ul
              className="post-hero-logo-list"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {stripLogos.map((client) => (
                <li key={client.name}>
                  <img
                    src={`/images/${client.image}`}
                    alt={duplicate ? "" : client.name}
                    width="150"
                    height="52"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        className="post-hero-logo-toggle"
        aria-controls="intro-client-belt"
        aria-label={paused ? "Play client strip" : "Pause client strip"}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      </button>
    </section>
  );
}
