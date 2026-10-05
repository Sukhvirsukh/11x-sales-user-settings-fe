import { apiFetch } from "@/lib/api";

interface ResendVerificationResponse {
    message?: string;
}

export function resendVerificationEmail(
    email: string,
): Promise<ResendVerificationResponse> {
    return apiFetch<ResendVerificationResponse>("/auth/resend-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        auth: false,
    });
}
