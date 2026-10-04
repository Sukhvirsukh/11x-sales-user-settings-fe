import type { ReactNode } from "react";
import type { Permission } from "./permissions";

export type AuthApiResponse = {
  accessToken?: string;
  user?: AuthApiUser;
  success?: boolean;
  message?: string;
};

export type AuthApiUser = {
  permissions?: unknown;
  id?: string;
  name?: string | null;
  email?: string;
  role?: string;
  phone?: string;
};

export type AuthRequestValues = {
  name?: string;
  email?: string;
};

export interface AuthUser {
  permissions?: unknown;
  id?: string;
  name: string;
  email?: string;
  role?: string;
  phone?: string;
}

export type AgentRole = "owner" | "editor" | "member";

/** An agent (one store) the user can access, with their role on it — from the 11xSales backend. */
export interface ApiAgent {
  id: string;
  name: string;
  slug: string;
  status: string;
  role: AgentRole;
  widgetKey?: string;
  widgetConfig?: Record<string, unknown>;
  defaultLanguage?: string;
}

/** The user object the 11xSales backend returns. */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  adminId?: string | null;
  isVerified?: boolean;
}

/** Login, signup, refresh and GET /auth/me all describe the session this way. */
export interface ApiSession {
  user: ApiUser;
  agents: ApiAgent[];
  currentAgent: ApiAgent | null;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface AuthStore {
  user: AuthUser | null;
  name: string | null;
  email: string | null;
  role: string | null;
  phone: string | null;
  permissions: Permission[];
  setUser: (user: AuthUser | undefined) => void;
  clearUser: () => void;
}

export interface AuthFormProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  withSocials?: boolean;
}
