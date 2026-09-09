import { apiFetch } from "@/lib/api";
import type { AuthApiUser, AuthUser } from "@/features/auth/authTypes";
import type { BasicDetailsFormValues } from "./basicDetailsTypes";

type ProfileResponse = AuthApiUser & {
    data?: AuthApiUser;
    user?: AuthApiUser;
};

export async function updateProfile(
    values: BasicDetailsFormValues,
): Promise<AuthUser> {
    const response = await apiFetch<ProfileResponse>("/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            phone: values.phone.trim(),
        }),
    });
    const profile = response.data ?? response.user ?? response;

    return {
        id: profile.id,
        name: profile.name?.trim() || values.name.trim(),
        email: profile.email ?? values.email.trim().toLowerCase(),
        phone: profile.phone ?? values.phone.trim(),
        role: profile.role,
    };
}
