import { apiFetch } from "@/lib/api";

export function forgotPasswordRequest(email: string) {
    return apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}
