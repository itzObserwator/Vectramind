"use client";

import { useState, useRef, type CSSProperties } from "react";
import { useNearViewport } from "@/components/use-near-viewport";
import { clientLogos } from "@/content/site";

export function ClientLogoGrid() {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root, "0px");
  const logos = expanded ? clientLogos : clientLogos.slice(0, 12);
  return (
    <div
      ref={root}
      className="client-directory"
      data-visible={ready || expanded}
    >
      <ul
        id="client-directory-logos"
        className="client-directory-grid"
        aria-label="Selected Vectramind clients"
      >
        {logos.map((client) => (
          <li
            key={client.name}
            style={
              {
                "--logo-delay": `${logos.indexOf(client) * 0.035}s`,
              } as CSSProperties
            }
          >
            <img
              src={`/images/${client.image}`}
              alt={client.name}
              width={200}
              height={90}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
      <div className="client-directory-caption">
        <p>Across healthcare, finance, government and beyond.</p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="client-directory-logos"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer clients" : "Show all clients"}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </div>
    </div>
  );
}
