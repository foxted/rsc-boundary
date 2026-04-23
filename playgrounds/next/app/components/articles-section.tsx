"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "../lib/data";
import { BookmarkButton } from "./bookmark-button";

interface ArticlesSectionProps {
  articles: Article[];
}

export function ArticlesSection({ articles }: ArticlesSectionProps) {
  const [query, setQuery] = useState("");

  const displayed = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
      )
    : articles;

  return (
    <div>
      <div className="section-head">
        <div className="section-head-left">
          <h2 className="section-title">Recent Articles</h2>
          <span className="section-count">{displayed.length} posts</span>
        </div>
        <div className="search-box search-box-inline">
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
      </div>

      {displayed.length === 0 ? (
        <p className="search-empty">No articles match your search.</p>
      ) : (
        <div className="posts-grid">
          {displayed.map((article) => (
            <article key={article.id} className="post-card">
              <div className="tag-list">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <Link href={`/articles/${article.id}`} className="post-title-link">
                <h3 className="post-title">{article.title}</h3>
              </Link>
              <p className="post-excerpt">{article.excerpt}</p>
              <div className="post-footer">
                <div className="author-meta">
                  <div className="avatar">{article.author.initials}</div>
                  <span>{article.author.name}</span>
                  <span className="read-time">· {article.readTime} min</span>
                </div>
                <BookmarkButton articleId={article.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
