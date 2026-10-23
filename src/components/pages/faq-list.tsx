"use client";
import { useState } from "react";
export function FaqList({
  items,
  searchable = false,
}: {
  items: readonly (readonly [string, string])[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) =>
    item.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="faq-list">
      {searchable && (
        <label className="faq-search">
          <span className="eyebrow">Find an answer</span>
          <input
            type="search"
            placeholder="Search questions, products, integrations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}
      <div aria-live="polite">
        {filtered.length === 0 && (
          <p className="empty-results">
            No matching answers. Try another search or contact our team.
          </p>
        )}
        {filtered.map(([question, answer], i) => (
          <details key={question}>
            <summary>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              {question}
              <span className="faq-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
