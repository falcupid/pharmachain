import { Navigate, Outlet, useLocation } from "react-router-dom";

type UserRole =
  | "admin"
  | "pharmaceutical_company"
  | "dispatcher"
  | "pharmachain_employee";

type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  company_name: string | null;
};

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const token = localStorage.getItem(
    "pharmachain_token",
  );

  const storedUser =
    localStorage.getItem("pharmachain_user");

  // User is not logged in
  if (!token || !storedUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  let user: StoredUser;

  try {
    user = JSON.parse(storedUser) as StoredUser;
  } catch {
    localStorage.removeItem("pharmachain_token");
    localStorage.removeItem("pharmachain_user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // If this route has role restrictions,
  // check the user's role.
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}