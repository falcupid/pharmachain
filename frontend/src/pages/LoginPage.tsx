import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginRole =
  | "admin"
  | "pharmaceutical_company"
  | "dispatcher"
  | "pharmachain_employee";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    company_name: string | null;
  };
};

const roleOptions = [
  {
    value: "pharmaceutical_company",
    label: "Pharmaceutical Company",
  },
  {
    value: "dispatcher",
    label: "Dispatcher",
  },
  {
    value: "pharmachain_employee",
    label: "PharmaChain Employee",
  },
  {
    value: "admin",
    label: "Administrator",
  },
] as const;

const demoAccounts: Record<
  LoginRole,
  { email: string; password: string }
> = {
  pharmaceutical_company: {
    email: "company@pharmachain.com",
    password: "Company123!",
  },
  dispatcher: {
    email: "dispatcher@pharmachain.com",
    password: "Dispatcher123!",
  },
  pharmachain_employee: {
    email: "employee@pharmachain.com",
    password: "Employee123!",
  },
  admin: {
    email: "admin@pharmachain.com",
    password: "Admin123!",
  },
};

export function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<LoginRole>("pharmaceutical_company");
  const [email, setEmail] = useState(
    demoAccounts.pharmaceutical_company.email,
  );
  const [password, setPassword] = useState(
    demoAccounts.pharmaceutical_company.password,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleRoleChange(nextRole: LoginRole) {
    setRole(nextRole);
    setEmail(demoAccounts[nextRole].email);
    setPassword(demoAccounts[nextRole].password);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data: LoginResponse | { detail?: string } =
        await response.json();

      if (!response.ok) {
        setError(
          "detail" in data && data.detail
            ? data.detail
            : "Login failed. Please check your email and password.",
        );
        return;
      }

      const loginData = data as LoginResponse;

      if (loginData.user.role !== role) {
        setError(
          "The selected login type does not match this account.",
        );
        return;
      }

      localStorage.setItem(
        "pharmachain_token",
        loginData.access_token,
      );

      localStorage.setItem(
        "pharmachain_user",
        JSON.stringify(loginData.user),
      );

      navigate("/");
    } catch {
      setError(
        "Unable to connect to PharmaChain. Make sure the backend is running.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <form
        className="glass-card form-card"
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <div className="section-copy">
          <p className="eyebrow">PharmaChain</p>

          <h2>Sign in</h2>

          <p>
            Sign in to monitor products, shipments, and supply-chain
            operations.
          </p>
        </div>

        <div className="field-grid single-column">
          <label>
            <span>Login as</span>

            <select
              value={role}
              onChange={(event) =>
                handleRoleChange(event.target.value as LoginRole)
              }
              style={{
                width: "100%",
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                borderRadius: "1rem",
                padding: "0.92rem 1rem",
                color: "var(--text)",
                outline: "none",
              }}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
        </div>

        {error && (
          <p
            style={{
              margin: 0,
              color: "#b42318",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}