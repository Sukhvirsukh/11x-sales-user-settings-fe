import { apiFetch } from "@/lib/api";

interface ForgotPasswordResponse {
    message?: string;
}

export function forgotPasswordRequest(email: string): Promise<ForgotPasswordResponse> {
    return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        auth: false,
    });
}
