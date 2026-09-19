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

export interface AuthResponse {
  accessToken: string;
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
