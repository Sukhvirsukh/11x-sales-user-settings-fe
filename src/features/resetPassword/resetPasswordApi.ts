import { apiFetch } from "@/lib/api";

export function resetPasswordRequest({
    token,
    password,
}: {
    token: string;
    password: string;
}) {
    return apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    });
}