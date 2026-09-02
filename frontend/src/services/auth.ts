export type UserRole =
  | "admin"
  | "pharmaceutical_company"
  | "dispatcher"
  | "pharmachain_employee";

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  company_name: string | null;
};

export function getCurrentUser(): StoredUser | null {
  const rawUser = localStorage.getItem("pharmachain_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(): UserRole | null {
  return getCurrentUser()?.role ?? null;
}

export function isAdmin(): boolean {
  return getCurrentUserRole() === "admin";
}

export function isPharmaceuticalCompany(): boolean {
  return getCurrentUserRole() === "pharmaceutical_company";
}

export function isDispatcher(): boolean {
  return getCurrentUserRole() === "dispatcher";
}

export function isPharmaChainEmployee(): boolean {
  return getCurrentUserRole() === "pharmachain_employee";
}

export function hasAnyRole(roles: UserRole[]): boolean {
  const role = getCurrentUserRole();

  if (!role) {
    return false;
  }

  return roles.includes(role);
}

export function logout(): void {
  localStorage.removeItem("pharmachain_token");
  localStorage.removeItem("pharmachain_user");
}