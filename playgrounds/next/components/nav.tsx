"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="nav">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`nav-link${pathname === href ? " nav-link-active" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
