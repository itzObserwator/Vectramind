"use client";
import Link from "next/link";
import { useState } from "react";
import posts from "@/content/imported/post-summaries.json";
import { Arrow, SectionLabel } from "@/components/site-primitives";
import { PageHero, PageCta } from "./page-primitives";

export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All insights");
  const categories = ["All insights", ...new Set(posts.map((p) => p.category))];
  const filtered = posts.filter(
    (post) =>
      (category === "All insights" || post.category === category) &&
      `${post.title} ${post.excerpt} ${post.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="inner-page">
      <PageHero
        eyebrow="Ideas from Vectramind"
        title={["Fresh thinking.", "Forward motion."]}
        description="Practical ideas, healthcare insights and technology stories. Explore the possibilities shaping better human experiences."
      />
      <section className="insights-section page-padding inner-section">
        <SectionLabel right={`${posts.length} perspectives`}>
          The latest from our minds
        </SectionLabel>
        <div className="insights-toolbar">
          <label>
            <span className="sr-only">Search insights</span>
            <input
              type="search"
              placeholder="Search ideas, topics, stories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Filter insights by topic</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="insights-count" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "perspective" : "perspectives"}
          {query ? ` matching “${query}”` : " to explore"}
        </p>
        {filtered.length ? (
          <div className="insights-grid">
            {filtered.map((post, i) => (
              <article
                className={
                  i === 0 && category === "All insights" && !query
                    ? "featured-insight"
                    : ""
                }
                key={post.slug}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="insight-image"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img src={post.image} alt="" loading="lazy" />
                  <span>
                    <Arrow />
                  </span>
                </Link>
                <div className="insight-copy">
                  <span className="eyebrow">
                    {post.category} / Vectramind perspectives
                  </span>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-link">
                    Read the perspective
                    <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h2>No matching perspectives.</h2>
            <p>Try another topic or clear your search.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setCategory("All insights");
              }}
            >
              Show all insights
            </button>
          </div>
        )}
      </section>
      <PageCta title="Turn a fresh perspective into progress." />
    </div>
  );
}
