import type { ReactNode } from "react";

export type AuthApiResponse = {
  accessToken?: string;
  user?: AuthApiUser;
  success?: boolean;
  message?: string;
};

export type AuthApiUser = {
  id?: string;
  name?: string | null;
  email?: string;
  role?: string;
};

export type AuthRequestValues = {
  name?: string;
  email?: string;
};

export interface AuthUser {
  id?: string;
  name: string;
  email?: string;
  role?: string;
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
    setUser: (user: AuthUser | undefined) => void;
    clearUser: () => void;
}

export interface AuthFormProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    withSocials?: boolean;
}
