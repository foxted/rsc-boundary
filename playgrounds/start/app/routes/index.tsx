import { createFileRoute } from "@tanstack/react-router";
import { RscServerBoundaryMarker } from "@rsc-boundary/start";
import { Header } from "../components/header";
import { SearchBar } from "../components/search-bar";
import { BookmarkButton } from "../components/bookmark-button";
import { NewsletterForm } from "../components/newsletter-form";
import { articles, featuredArticle, gridArticles, siteStats } from "../lib/data";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Server-rendered wrapper — contains Nav (client-stateful) island */}
      <Header />

      <main>
        <div className="container">
          {/* ── Featured article (server) ─────────────────── */}
          <RscServerBoundaryMarker label="FeaturedPost">
            <section className="hero">
              <span className="badge">★ Featured</span>
              <h1 className="hero-title">{featuredArticle.title}</h1>
              <p className="hero-excerpt">{featuredArticle.excerpt}</p>
              <div className="hero-meta">
                <div className="avatar">{featuredArticle.author.initials}</div>
                <span>{featuredArticle.author.name}</span>
                <span className="hero-meta-sep">·</span>
                <span>{featuredArticle.date}</span>
                <span className="hero-meta-sep">·</span>
                <span>{featuredArticle.readTime} min read</span>
              </div>
            </section>
          </RscServerBoundaryMarker>

          {/* ── Stats bar (server) ────────────────────────── */}
          <RscServerBoundaryMarker label="StatsBar">
            <div className="stats-bar">
              {Object.entries(siteStats).map(([key, val]) => (
                <div key={key}>
                  <div className="stat-value">{val}</div>
                  <div className="stat-label">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </RscServerBoundaryMarker>

          {/* ── Search bar (client — has useState) ───────── */}
          <SearchBar articles={articles} />

          {/* ── Posts grid (server, with client bookmark islands) ── */}
          <RscServerBoundaryMarker label="PostsGrid">
            <div>
              <div className="section-head">
                <h2 className="section-title">Recent Articles</h2>
                <span className="section-count">{gridArticles.length} posts</span>
              </div>
              <div className="posts-grid">
                {gridArticles.map((article) => (
                  <article key={article.id} className="post-card">
                    <div className="tag-list">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <h3 className="post-title">{article.title}</h3>
                    <p className="post-excerpt">{article.excerpt}</p>
                    <div className="post-footer">
                      <div className="author-meta">
                        <div className="avatar">{article.author.initials}</div>
                        <span>{article.author.name}</span>
                        <span className="read-time">· {article.readTime} min</span>
                      </div>
                      {/* Client island — has useState */}
                      <BookmarkButton articleId={article.id} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </RscServerBoundaryMarker>

          {/* ── Newsletter (client — has useState) ───────── */}
          <NewsletterForm />
        </div>
      </main>

      {/* ── Footer (server) ───────────────────────────── */}
      <RscServerBoundaryMarker label="Footer">
        <footer className="site-footer">
          <div className="container footer-inner">
            <span>© 2026 DevPulse. Built to demo RSC Boundary.</span>
            <nav className="footer-links">
              <a href="/about" className="footer-link">About</a>
              <a
                href="https://github.com/nicnocquee/rsc-boundary"
                className="footer-link"
              >
                GitHub
              </a>
            </nav>
          </div>
        </footer>
      </RscServerBoundaryMarker>
    </>
  );
}
