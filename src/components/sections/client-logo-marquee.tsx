"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clientLogos } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  clientLogos.filter((_, index) => index % 2 === 0),
  clientLogos.filter((_, index) => index % 2 === 1),
];

export function ClientLogoMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "150px" });
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<"waiting" | "revealing" | "complete">(
    "waiting",
  );
  const completed = useRef(false);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced || completed.current) {
          completed.current = true;
          setPhase("complete");
          return;
        }
        const element = root.current;
        if (!element) return;
        const group = element.querySelector(".client-logo-rows");
        const bottomRow = element.querySelector(".client-logo-row.is-reversed");
        const images = element.querySelectorAll(".client-logo-badge img");
        const gap = parseFloat(
          getComputedStyle(element).getPropertyValue("--client-gap"),
        );
        gsap.set(group, { autoAlpha: 0, y: 32 });
        // Explicit pixel and percentage offsets avoid double-counting the
        // CSS fallback transform when GSAP takes ownership of the entrance.
        gsap.set(bottomRow, { y: -gap, yPercent: -100 });
        gsap.set(images, { autoAlpha: 0, y: 8 });
        const reveal = gsap.timeline({
          paused: true,
          onComplete() {
            completed.current = true;
            setPhase("complete");
          },
        });
        reveal
          .to(
            group,
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0,
          )
          .to(
            bottomRow,
            { y: 0, yPercent: 0, duration: 0.85, ease: "power3.out" },
            0.12,
          )
          .to(
            images,
            { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" },
            0.9,
          );
        ScrollTrigger.create({
          trigger: element,
          start: "top 87%",
          once: true,
          onEnter() {
            setPhase("revealing");
            reveal.play();
          },
        });
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <div
      className="client-partners"
      ref={root}
      data-paused={paused || !visible || phase !== "complete"}
      data-reveal-phase={phase}
    >
      <div id="client-logo-rows" className="client-logo-rows">
        {rows.map((logos, rowIndex) => (
          <div
            className={`client-logo-row ${rowIndex === 1 ? "is-reversed" : ""}`}
            key={rowIndex}
            role="region"
            aria-label={`Client logos, row ${rowIndex + 1}`}
            tabIndex={0}
            style={
              {
                "--client-loop-duration": `${logos.length * 8}s`,
              } as CSSProperties
            }
          >
            <div className="client-logo-belt">
              {/* Equal-width copies make the loop seamless. Only the original
                  list is exposed to assistive technology. */}
              {[false, true].map((duplicate) => (
                <ul
                  className="client-logo-list"
                  role="list"
                  key={String(duplicate)}
                  aria-hidden={duplicate || undefined}
                >
                  {logos.map((client) => (
                    <li className="client-logo-badge" key={client.name}>
                      <img
                        src={`/images/${client.image}`}
                        alt={duplicate ? "" : client.name}
                        width={200}
                        height={90}
                        loading="lazy"
                        decoding="async"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="client-logo-controls page-padding">
        <button
          type="button"
          className="client-motion-toggle"
          aria-controls="client-logo-rows"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Play logos" : "Pause logos"}
        </button>
      </div>
    </div>
  );
}
