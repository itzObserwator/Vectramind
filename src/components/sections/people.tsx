"use client";

import { useRef, useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { SectionLabel } from "@/components/site-primitives";
export function People() {
  const [slide, setSlide] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const images = [
    {
      src: "ceo_about.webp",
      label: "Dr. Murali Krishna Vakalapudi",
      caption: "Founder & CEO",
    },
    {
      src: "milestone-01.jpg",
      label: "Ideas that bring us together",
      caption: "A milestone moment for Vectramind",
      alt: "Vectramind’s founder at a meeting in Dubai",
      wide: true,
    },
    {
      src: "event-31.webp",
      label: "A global perspective",
      caption: "Team Vectramind",
    },
    {
      src: "career.webp",
      label: "Curious minds. Shared purpose.",
      caption: "Life at Vectramind",
    },
  ];
  return (
    <section className="people page-padding section-space">
      <SectionLabel right="07 / The minds behind the momentum">
        Meet Vectramind
      </SectionLabel>
      <div className="people-heading">
        <h2 className="display" data-reveal>
          Great minds.
          <br />
          Human at heart.
        </h2>
        <div className="slider-controls">
          <button
            aria-label="Previous team photo"
            onClick={() => {
              const next = Math.max(0, slide - 1);
              setSlide(next);
              ref.current?.children[next].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });
            }}
            disabled={slide === 0}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={22}
              className="rotate-180"
            />
          </button>
          <button
            aria-label="Next team photo"
            onClick={() => {
              const next = Math.min(images.length - 1, slide + 1);
              setSlide(next);
              ref.current?.children[next].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });
            }}
            disabled={slide === images.length - 1}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
          </button>
        </div>
      </div>
      <div
        className="people-slider"
        ref={ref}
        role="region"
        aria-label="Vectramind team photos"
        tabIndex={0}
      >
        {images.map((item) => (
          <figure
            key={item.src}
            className={item.wide ? "people-photo-wide" : undefined}
          >
            <div className="people-image">
              <img
                src={`/images/${item.src}`}
                alt={item.alt || item.label}
                loading="lazy"
              />
            </div>
            <figcaption>
              <strong>{item.label}</strong>
              <span>{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
