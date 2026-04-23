import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <nav>
      <ul className="nav">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="nav-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
