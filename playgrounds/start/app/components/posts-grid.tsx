import { RscServerBoundaryMarker } from "@rsc-boundary/start";
import { gridArticles } from "../lib/data";
import { BookmarkButton } from "./bookmark-button";

export function PostsGrid() {
  return (
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
                <BookmarkButton articleId={article.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </RscServerBoundaryMarker>
  );
}
