import { RscServerBoundaryMarker } from "@rsc-boundary/next";
import { featuredArticle } from "../lib/data";

export function FeaturedPost() {
  return (
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
  );
}
