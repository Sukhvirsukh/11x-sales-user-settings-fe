import { authRequest } from "@/features/auth/authApi";
import type { AuthResponse } from "@/features/auth/authTypes";
import type { SignUpFormValues } from "./signUpTypes";

export function signUpRequest(
  values: SignUpFormValues,
): Promise<AuthResponse> {
  return authRequest("/auth/signup", {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
  });
}
