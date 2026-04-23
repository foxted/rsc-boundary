import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section className="newsletter">
      <h2>Stay in the loop</h2>
      <p>
        Get the best articles on React, performance, and developer tooling
        <br />
        delivered to your inbox every two weeks.
      </p>
      {submitted ? (
        <p className="newsletter-thanks">
          ✓ You&apos;re subscribed! Check your inbox for a confirmation.
        </p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className="newsletter-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" className="btn-white">
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
