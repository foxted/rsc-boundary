import { RscServerBoundaryMarker } from "@rsc-boundary/next";

export function Footer() {
  return (
    <RscServerBoundaryMarker label="Footer">
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© 2026 DevPulse. Built to demo RSC Boundary.</span>
          <nav className="footer-links">
            <a href="/about" className="footer-link">
              About
            </a>
            <a
              href="https://github.com/foxted/rsc-boundary"
              className="footer-link"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </RscServerBoundaryMarker>
  );
}
