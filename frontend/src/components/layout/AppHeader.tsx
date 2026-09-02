import { NavLink, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  hasAnyRole,
  logout,
  type UserRole,
} from "../../services/auth";

type NavigationLink = {
  to: string;
  label: string;
  roles: UserRole[];
};

const links: NavigationLink[] = [
  {
    to: "/",
    label: "Overview",
    roles: [
      "admin",
      "pharmaceutical_company",
      "dispatcher",
      "pharmachain_employee",
    ],
  },
  {
    to: "/products",
    label: "Products",
    roles: [
      "admin",
      "pharmaceutical_company",
      "dispatcher",
      "pharmachain_employee",
    ],
  },
  {
    to: "/operations",
    label: "Operations",
    roles: [
      "admin",
      "pharmaceutical_company",
      "dispatcher",
    ],
  },
  {
    to: "/tracking",
    label: "Tracking",
    roles: [
      "admin",
      "pharmaceutical_company",
      "dispatcher",
      "pharmachain_employee",
    ],
  },
];

function getRoleDescription(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrator";

    case "pharmaceutical_company":
      return "Pharmaceutical Company";

    case "dispatcher":
      return "Dispatcher";

    case "pharmachain_employee":
      return "PharmaChain Employee";

    default:
      return role;
  }
}

export function AppHeader() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const visibleLinks = links.filter((link) =>
    hasAnyRole(link.roles),
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-header">
      <div className="brand-mark">
        <span className="brand-badge">PC</span>

        <div className="brand-copy">
          <p className="brand-kicker">PharmaChain</p>

          <h1>Traceable logistics, without the noise.</h1>

          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.82rem",
              color: "var(--muted)",
            }}
          >
            {user.name}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            Role: {getRoleDescription(user.role)}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          flexWrap: "wrap",
        }}
      >
        <nav className="site-nav" aria-label="Primary">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " is-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="primary-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}