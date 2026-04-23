import { createFileRoute } from "@tanstack/react-router";
import { ArticlesSection } from "../components/articles-section";
import { FeaturedPost } from "../components/featured-post";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { NewsletterForm } from "../components/newsletter-form";
import { StatsBar } from "../components/stats-bar";
import { gridArticles } from "../lib/data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "DevPulse — TanStack Start Playground" }] }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Header />

      <main>
        <div className="container">
          <FeaturedPost />
          <StatsBar />
          <ArticlesSection articles={gridArticles} />
          <NewsletterForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
