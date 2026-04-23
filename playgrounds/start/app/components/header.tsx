import { Link } from "@tanstack/react-router";
import { Nav } from "./nav";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Dev<span className="logo-dot">Pulse</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
