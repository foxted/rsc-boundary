import { notFound } from "next/navigation";
import Link from "next/link";
import { RscServerBoundaryMarker } from "@rsc-boundary/next";
import { Header } from "../../components/header";
import { BookmarkButton } from "../../components/bookmark-button";
import { Footer } from "../../components/footer";
import { articles } from "../../lib/data";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  return { title: article ? `${article.title} — DevPulse` : "Not Found" };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) notFound();

  return (
    <>
      <Header />

      <main>
        <div className="container">
          <RscServerBoundaryMarker label="ArticleContent">
            <Link href="/" className="article-back">
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
