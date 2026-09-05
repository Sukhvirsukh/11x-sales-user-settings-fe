const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
export const AUTH_TOKEN_STORAGE_KEY = "vitalb.jwt";

type ApiErrorResponse = {
    message?: string | string[];
};

type AuthApiResponse = {
    accessToken?: string;
    user?: AuthApiUser;
    success?: boolean;
    message?: string;
};

type AuthApiUser = {
    id?: string;
    name?: string | null;
    email?: string;
    role?: string;
};

type AuthRequestValues = {
    name?: string;
    email?: string;
};

export interface AuthUser {
    id?: string;
    name: string;
    email?: string;
    role?: string;
}

export interface AuthResponse {
    accessToken: string;
    user?: AuthUser;
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function storeAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

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
        user.name?.trim() ||
        fallbackName ||
        "Account";

    return {
        id: user.id,
        name,
        email: user.email,
        role: user.role,
    };
}

export async function authRequest<TValues>(
    endpoint: string,
    values: TValues,
): Promise<AuthResponse> {
    if (!AUTH_API_BASE_URL?.trim()) {
        throw new Error("Authentication service is not configured. Please contact support.");
    }

    const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const body = (await response.json().catch(() => ({}))) as
        | AuthApiResponse
        | ApiErrorResponse;

    if (!response.ok) {
        const message = "message" in body ? body.message : undefined;
        throw new Error(
            Array.isArray(message)
                ? message.join(" ")
                : message ?? "Authentication request failed. Please try again.",
        );
    }

    const authBody = body as AuthApiResponse;
    if (!authBody.accessToken) {
        throw new Error("Authentication response did not include a JWT.");
    }

    return {
        accessToken: authBody.accessToken,
        user: getUser(authBody, values as AuthRequestValues),
    };
}
