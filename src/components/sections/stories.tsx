"use client";
import Link from "next/link";
import { stories } from "@/content/site";
import { Arrow, Mark } from "@/components/site-primitives";

export function Stories() {
  return (
    <section id="about" className="stories">
      {stories.map((story, i) => (
        <article className="story" key={story.title} style={{ zIndex: i + 1 }}>
          <div className="story-copy">
            <span className="eyebrow">{story.eyebrow}</span>
            <div className="story-number">0{i + 1}</div>
            <h2 data-reveal>{story.title}</h2>
            <p>{story.text}</p>
            <Link className="text-link" href={story.link}>
              {story.cta}
              <Arrow />
            </Link>
            <Mark className="story-mark" />
          </div>
          <div className="story-image">
            <img
              src={`/images/${story.image}`}
              alt={
                i === 0
                  ? "Patients and healthcare staff at reception, from Vectramind’s Firstpass page"
                  : i === 1
                    ? "The people and culture at Vectramind"
                    : "The Vectramind team together"
              }
              loading="lazy"
              data-parallax
            />
          </div>
        </article>
      ))}
    </section>
  );
}
