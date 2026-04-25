"use client";

import { useState } from "react";
import type { Article } from "../lib/data";

interface SearchBarProps {
  articles: Article[];
}

export function SearchBar({ articles }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const matches = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
      )
    : null;

  return (
    <div className="search-wrap">
      <div className="search-box">
        <span className="search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="Search articles, topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search articles"
        />
      </div>
      {matches !== null && (
        <div className="search-results">
          {matches.length === 0 ? (
            <p className="search-hint">No articles match your search.</p>
          ) : (
            <>
              <p className="search-hint">
                {matches.length} article{matches.length === 1 ? "" : "s"} found
              </p>
              <ul className="search-results-list">
                {matches.map((article) => (
                  <li key={article.id} className="search-result-item">
                    <div className="tag-list">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <p className="search-result-title">{article.title}</p>
                    <p className="search-result-meta">
                      {article.author.name} · {article.date} · {article.readTime} min read
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
