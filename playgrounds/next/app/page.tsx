import { Header } from "./components/header";
import { ArticlesSection } from "./components/articles-section";
import { NewsletterForm } from "./components/newsletter-form";
import { FeaturedPost } from "./components/featured-post";
import { StatsBar } from "./components/stats-bar";
import { Footer } from "./components/footer";
import { gridArticles } from "./lib/data";

export default function HomePage() {
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
