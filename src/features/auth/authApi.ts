import { apiFetch } from "@/lib/api";
import type { AuthApiResponse, AuthRequestValues, AuthResponse, AuthUser } from "./authTypes";

function getUser(
  response: AuthApiResponse,
  values?: AuthRequestValues,
): AuthUser | undefined {
  const user = response.user;
  const fallbackName = values?.name?.trim() || values?.email?.trim();

  if (!user) {
    return fallbackName
      ? {
          name: fallbackName,
          email: values?.email,
        }
      : undefined;
  }

  const name =
    user.name?.trim() || fallbackName || "Account";

  return {
    id: user.id,
    name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}

export async function authRequest<TValues>(
  endpoint: string,
  values: TValues,
): Promise<AuthResponse> {
  const authBody = await apiFetch<AuthApiResponse>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    auth: false,
  });

  if (!authBody.accessToken) {
    throw new Error("Authentication response did not include a JWT.");
  }

  return {
    accessToken: authBody.accessToken,
    user: getUser(authBody, values as AuthRequestValues),
  };
}
