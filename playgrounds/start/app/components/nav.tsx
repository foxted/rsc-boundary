import { Link } from "@tanstack/react-router";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
];

export function Nav() {
  return (
    <nav>
      <ul className="nav">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="nav-link"
              activeProps={{ className: "nav-link nav-link-active" }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
