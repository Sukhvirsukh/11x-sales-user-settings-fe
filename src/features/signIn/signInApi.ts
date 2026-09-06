import { authRequest } from "@/features/auth/authApi";
import type { AuthResponse } from "@/features/auth/authTypes";
import type { SignInFormValues } from "./signInTypes";

export function signInRequest(
  values: SignInFormValues,
): Promise<AuthResponse> {
  return authRequest("/auth/login", {
    email: values.email.trim().toLowerCase(),
    password: values.password,
  });
}
