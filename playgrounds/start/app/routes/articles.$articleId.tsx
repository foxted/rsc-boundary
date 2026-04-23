import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RscServerBoundaryMarker } from "@rsc-boundary/start";
import { Header } from "../components/header";
import { BookmarkButton } from "../components/bookmark-button";
import { Footer } from "../components/footer";
import { articles } from "../lib/data";

export const Route = createFileRoute("/articles/$articleId")({
  component: ArticlePage,
  loader: ({ params }) => {
    const article = articles.find((a) => a.id === params.articleId);
    if (!article) throw notFound();
    return { article };
  },
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <>
      <Header />

      <main>
        <div className="container">
          <RscServerBoundaryMarker label="ArticleContent">
            <Link to="/" className="article-back">
              ← Back to articles
            </Link>

            <header className="article-header">
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">
                <div className="avatar">{article.author.initials}</div>
                <span>{article.author.name}</span>
                <span className="article-meta-sep">·</span>
                <span>{article.date}</span>
                <span className="article-meta-sep">·</span>
                <span>{article.readTime} min read</span>
              </div>
            </header>

            <hr className="article-divider" />

            <div className="article-body">
              <p>{article.excerpt}</p>
              <p>
                This is a demo article page generated to showcase the RSC Boundary
                devtool. In a real application, this would render the full article
                content — server-rendered with zero client JavaScript for the prose
                itself. Only the interactive islands below are hydrated.
              </p>
            </div>
          </RscServerBoundaryMarker>

          <div className="article-actions">
            <BookmarkButton articleId={article.id} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
