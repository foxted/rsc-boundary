import { createFileRoute } from "@tanstack/react-router";
import { RscServerBoundaryMarker } from "@rsc-boundary/start";
import { Header } from "../components/header";
import { FaqAccordion } from "../components/faq-accordion";
import { faqs, teamMembers, techStack } from "../lib/data";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Header />

      <main>
        <div className="container">
          {/* ── Hero (server) ─────────────────────────────── */}
          <RscServerBoundaryMarker label="AboutHero">
            <section className="about-hero">
              <h1 className="about-title">
                We make great
                <br />
                engineering writing.
              </h1>
              <p className="about-lead">
                DevPulse is a curated publication for developers who care about
                the craft — from React internals to database performance to the
                economics of open source. No fluff. No paywalls.
              </p>
            </section>
          </RscServerBoundaryMarker>

          <hr className="divider" />

          {/* ── Team (server) ─────────────────────────────── */}
          <RscServerBoundaryMarker label="TeamSection">
            <section className="page-section">
              <h2 className="page-section-title">The team</h2>
              <p className="page-section-subtitle">
                Four engineers and one too many opinions about state management.
              </p>
              <div className="team-grid">
                {teamMembers.map((member) => (
                  <div key={member.name} className="team-card">
                    <div
                      style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        background: member.color,
                        color: "#4338ca",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.75rem",
                      }}
                    >
                      {member.initials}
                    </div>
                    <div className="team-name">{member.name}</div>
                    <div className="team-role">{member.role}</div>
                  </div>
                ))}
              </div>
            </section>
          </RscServerBoundaryMarker>

          <hr className="divider" />

          {/* ── Tech stack (server) ───────────────────────── */}
          <RscServerBoundaryMarker label="TechStack">
            <section className="page-section">
              <h2 className="page-section-title">Built with</h2>
              <p className="page-section-subtitle">The stack behind DevPulse.</p>
              <div className="stack-grid">
                {techStack.map((item) => (
                  <div key={item.name} className="stack-card">
                    <span className="stack-emoji" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <div>
                      <div className="stack-name">{item.name}</div>
                      <div className="stack-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </RscServerBoundaryMarker>

          <hr className="divider" />

          {/* ── FAQ (client — accordion has useState) ─────── */}
          <section className="page-section">
            <h2 className="page-section-title">FAQ</h2>
            <p className="page-section-subtitle">
              Questions about RSC, this demo, and everything in between.
            </p>
            <FaqAccordion items={faqs} />
          </section>
        </div>
      </main>

      {/* ── Footer (server) ───────────────────────────── */}
      <RscServerBoundaryMarker label="Footer">
        <footer className="site-footer">
          <div className="container footer-inner">
            <span>© 2026 DevPulse. Built to demo RSC Boundary.</span>
            <nav className="footer-links">
              <a href="/" className="footer-link">Home</a>
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
