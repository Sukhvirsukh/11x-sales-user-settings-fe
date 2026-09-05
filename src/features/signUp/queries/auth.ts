import { authRequest, type AuthResponse } from "@/features/auth/authRequest";
import type { SignUpFormValues } from "../schema";

export function signUpRequest(
    values: SignUpFormValues,
): Promise<AuthResponse> {
    return authRequest("/api/auth/signup", {
        // name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
    });
}
