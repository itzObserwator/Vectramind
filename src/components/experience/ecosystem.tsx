"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Arrow, Mark } from "@/components/site-primitives";
import { ecosystemNodes, experience } from "@/content/experience";
import { EcosystemOrbits, orbitPosition } from "./ecosystem-orbits";
import { createEcosystemEntrance } from "./ecosystem-motion";
import { EcosystemAtmosphere } from "./ecosystem-atmosphere";

gsap.registerPlugin(ScrollTrigger);

export function ConnectedEcosystem() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 901px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const section = root.current;
        if (!section) return;
        if (!context.conditions?.motion) {
          section.dataset.phase = "complete";
          return () => {
            delete section.dataset.phase;
          };
        }
        createEcosystemEntrance(section, !!context.conditions.desktop);
        const observer = new IntersectionObserver(([entry]) => {
          section.dataset.visible = String(entry.isIntersecting);
        });
        observer.observe(section);
        return () => {
          observer.disconnect();
          delete section.dataset.visible;
          delete section.dataset.phase;
        };
      },
      root,
    );
    return () => media.revert();
  }, []);

  const detailPosition =
    active === null
      ? null
      : orbitPosition(
          ecosystemNodes[active].ring,
          ecosystemNodes[active].angle,
        );
  return (
    <section
      id="ecosystem"
      className="experience-ecosystem orbital-ecosystem"
      ref={root}
      aria-labelledby="ecosystem-title"
    >
      <div className="ecosystem-sticky">
        <header className="ecosystem-heading">
          <span className="ecosystem-eyebrow">Connected by design</span>
          <h2 id="ecosystem-title">
            {experience.network.title.replace("\n", " ")}
          </h2>
        </header>
        <div
          className="ecosystem-diagram"
          onMouseLeave={() => setActive(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setActive(null);
          }}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setActive(null);
          }}
        >
          <EcosystemOrbits />
          <div
            className="ecosystem-hub"
            aria-label="Vectramind, at the center of your connected experience"
          >
            <Mark />
          </div>
          {ecosystemNodes.map((node, index) => {
            const { x, y } = orbitPosition(node.ring, node.angle);
            return (
              <button
                key={node.label}
                className={`ecosystem-node ecosystem-color-${node.color}`}
                data-ecosystem-node={index}
                style={
                  {
                    left: `${x / 10}%`,
                    top: `${(y / 650) * 100}%`,
                    zIndex: Math.round(y),
                  } as CSSProperties
                }
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                aria-label={node.label}
                aria-pressed={active === index}
                aria-describedby={
                  active === index ? "ecosystem-detail" : undefined
                }
              >
                <span className="ecosystem-sphere">
                  <span>
                    {"shortLabel" in node ? node.shortLabel : node.label}
                  </span>
                </span>
              </button>
            );
          })}
          {active !== null && (
            <div
              className="ecosystem-detail"
              id="ecosystem-detail"
              role="status"
              data-side={detailPosition!.x < 500 ? "left" : "right"}
              style={{
                left: `${detailPosition!.x / 10}%`,
                top: `${detailPosition!.y / 6.5}%`,
              }}
            >
              <span>{ecosystemNodes[active].label}</span>
              <p>{ecosystemNodes[active].detail}</p>
            </div>
          )}
        </div>
        <div className="ecosystem-mist" aria-hidden="true" />
        <EcosystemAtmosphere />
        <footer className="ecosystem-caption">
          <p>{experience.network.text}</p>
          <Link href="#products" className="text-link">
            Find your platform <Arrow />
          </Link>
        </footer>
      </div>
    </section>
  );
}
