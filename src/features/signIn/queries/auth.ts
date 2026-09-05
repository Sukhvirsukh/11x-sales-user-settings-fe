import { authRequest, type AuthResponse } from "@/features/auth/authRequest";
import type { SignInFormValues } from "../schema";

export function signInRequest(
    values: SignInFormValues,
): Promise<AuthResponse> {
    return authRequest("/api/auth/login", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
    });
}
