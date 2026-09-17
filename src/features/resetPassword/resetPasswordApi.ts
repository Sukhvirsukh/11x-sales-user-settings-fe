import { apiFetch } from "@/lib/api";

interface ResetPasswordResponse {
    message?: string;
}

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export function resetPasswordRequest(
    values: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
    return apiFetch<ResetPasswordResponse>("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        auth: false,
    });
}
