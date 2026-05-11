import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview" },
  { to: "/products", label: "Products" },
  { to: "/operations", label: "Operations" },
  { to: "/tracking", label: "Tracking" },
];

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="brand-mark">
        <span className="brand-badge">CS</span>
        <div className="brand-copy">
          <p className="brand-kicker">ChainSight</p>
          <h1>Traceable logistics, without the noise.</h1>
        </div>
      </div>

      <nav className="site-nav" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
