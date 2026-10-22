"use client";
import { useLayoutEffect, useRef, useState, useId } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReachGlobe } from "@/components/visuals/reach-globe";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import { statistics } from "@/content/site";
import { reachContent, reachLocations } from "@/content/global-reach";
gsap.registerPlugin(ScrollTrigger);
// Open, tapered bay-leaf branches: staggered leaves keep the small wreaths airy.
function MetricLaurel() {
  const branchPoint = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * 34 + 2 * u * t * 3 + t * t * 24,
      y: u * u * 64 + 2 * u * t * 42 + t * t * 7,
      angle:
        (Math.atan2(-44 * u - 70 * t, -62 * u + 42 * t) * 180) / Math.PI + 90,
    };
  };
  return (
    <svg viewBox="0 0 110 70" aria-hidden="true" focusable="false">
      {[false, true].map((mirrored) => (
        <g
          key={String(mirrored)}
          transform={mirrored ? "translate(110 0) scale(-1 1)" : undefined}
        >
          <path
            d="M34 64Q3 42 24 7"
            fill="none"
            stroke="currentColor"
            strokeWidth=".65"
            strokeLinecap="round"
          />
          {[0.13, 0.25, 0.37, 0.49, 0.61, 0.73, 0.85].flatMap((t, i) =>
            [-1, 1].map((side) => {
              const point = branchPoint(t + (side === 1 ? 0.045 : 0));
              const scale = [0.72, 0.88, 1, 1, 0.94, 0.82, 0.65][i];
              return (
                <g
                  key={`${i}-${side}`}
                  transform={`translate(${point.x} ${point.y}) rotate(${point.angle + side * 43}) scale(${scale} ${scale})`}
                >
                  <path
                    d="M0 0C-2.7-3.6-2.9-8.7 .6-12C3-7.9 2.9-3.3 0 0Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0-.8 .5-9.5"
                    fill="none"
                    stroke="#fafafa"
                    strokeOpacity=".65"
                    strokeWidth=".45"
                    strokeLinecap="round"
                  />
                </g>
              );
            }),
          )}
          <path
            d="M23.3 8.3C21.9 5.2 23.6 2.9 26.9 1.7C27.5 5.1 26.1 7.4 23.3 8.3Z"
            fill="currentColor"
          />
        </g>
      ))}
    </svg>
  );
}
export function GlobalReach() {
  const root = useRef<HTMLElement>(null);
  const [selectedOffice, setSelectedOffice] = useState(0);
  const officePrefix = useId();
  const office = reachLocations[selectedOffice];
  function selectOffice(index: number, focus = false) {
    const next = (index + reachLocations.length) % reachLocations.length;
    setSelectedOffice(next);
    if (focus) document.getElementById(`${officePrefix}-${next}`)?.focus();
  }
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 901px) and (min-height: 851px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const section = root.current;
        if (!section || !context.conditions?.motion) return;
        const select = gsap.utils.selector(section);
        const desktop = context.conditions.desktop;
        const count = { value: 0 };
        const number = section.querySelector(".reach-client-count");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: desktop ? "top top" : "top 65%",
            end: desktop ? "bottom bottom" : "+=850",
            scrub: desktop ? 0.7 : undefined,
            toggleActions: desktop ? undefined : "play none none reverse",
          },
        });
        timeline.fromTo(
          select(".reach-globe-scene"),
          { y: 40, scale: 1.06, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.43, ease: "power2.out" },
          0,
        );
        timeline.fromTo(
          select(".reach-copy h2, .reach-copy p, .reach-copy > a"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.23,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.1,
        );
        timeline.fromTo(
          select(".reach-highlight"),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
          0.19,
        );
        timeline.fromTo(
          count,
          { value: 0 },
          {
            value: 800,
            duration: 0.36,
            ease: "power2.out",
            onUpdate: () => {
              if (number) number.textContent = `${Math.round(count.value)}+`;
            },
          },
          0.2,
        );
        timeline.fromTo(
          select(".reach-metric"),
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, stagger: 0.06 },
          0.42,
        );
        timeline.fromTo(
          select(".reach-offices"),
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          0.55,
        );
        timeline.to({}, { duration: 0.19 }, 0.81);
        return () => {
          if (number) number.textContent = "800+";
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  return (
    <section
      id="global-reach"
      className="reference-reach"
      ref={root}
      aria-labelledby="reach-title"
    >
      <div className="reach-sticky">
        <div className="reach-section-label">
          <SectionLabel right="5 offices / 4 countries">
            {reachContent.title}
          </SectionLabel>
        </div>
        <div className="reach-overview">
          <div className="reach-copy">
            <h2 id="reach-title">
              Global reach.
              <br />
              Human touch.
            </h2>
            <p>{reachContent.description}</p>
            <Link href="/about" className="reach-about-link">
              Meet Vectramind <Arrow />
            </Link>
          </div>
        </div>
        <div className="reach-stage">
          <div className="reach-map-panel">
            <div className="reach-globe-scene">
              <ReachGlobe selectedOffice={selectedOffice} />
            </div>
          </div>
          <div className="reach-offices">
            <span className="reach-eyebrow">EXPLORE OUR OFFICES</span>
            <div
              className="reach-office-list"
              role="tablist"
              aria-label="Explore our offices"
              aria-orientation="vertical"
            >
              {reachLocations.map((location, index) => (
                <button
                  key={location.name}
                  id={`${officePrefix}-${index}`}
                  type="button"
                  role="tab"
                  aria-label={location.name}
                  aria-selected={selectedOffice === index}
                  aria-controls={`${officePrefix}-panel`}
                  tabIndex={selectedOffice === index ? 0 : -1}
                  onClick={() => selectOffice(index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight" || event.key === "ArrowDown"
                        ? selectedOffice + 1
                        : event.key === "ArrowLeft" || event.key === "ArrowUp"
                          ? selectedOffice - 1
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? reachLocations.length - 1
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      selectOffice(next, true);
                    }
                  }}
                >
                  <span className="reach-office-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="reach-office-name">
                    {location.name}
                    <small aria-hidden="true">{location.country}</small>
                  </span>
                  <Arrow />
                </button>
              ))}
            </div>
            <div
              className="reach-office-detail"
              id={`${officePrefix}-panel`}
              role="tabpanel"
              aria-labelledby={`${officePrefix}-${selectedOffice}`}
              tabIndex={0}
            >
              <div aria-live="polite" aria-atomic="true">
                <h3 className="sr-only">{office.name}</h3>
                <p>{office.country}</p>
              </div>
              <div className="reach-office-controls">
                <span>{String(selectedOffice + 1).padStart(2, "0")} / 05</span>
                <button
                  type="button"
                  aria-label="Previous office"
                  onClick={() => selectOffice(selectedOffice - 1)}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="reach-arrow-previous"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Next office"
                  onClick={() => selectOffice(selectedOffice + 1)}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="reach-statistics">
          <Link
            href="/about"
            className="reach-highlight"
            aria-label="800 plus clients around the world. About Vectramind."
          >
            <strong className="reach-client-count">800+</strong>
            <span>
              Clients worldwide <Arrow />
            </span>
          </Link>
          <div className="reach-metrics">
            {[statistics[1], statistics[2], statistics[4]].map((stat) => (
              <div className="reach-metric" key={stat.value}>
                <MetricLaurel />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
