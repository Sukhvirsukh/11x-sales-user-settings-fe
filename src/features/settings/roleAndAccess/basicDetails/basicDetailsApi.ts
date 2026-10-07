import { apiFetch } from "@/lib/api";
import { applySession } from "@/features/auth/authApi";
import type { ApiSession, AuthUser } from "@/features/auth/authTypes";
import type { BasicDetailsFormValues } from "./basicDetailsTypes";

export async function updateProfile(
    values: BasicDetailsFormValues,
): Promise<AuthUser> {
    const session = await apiFetch<ApiSession>("/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            phone: values.phone.trim(),
        }),
    });
    return applySession(session);
}
