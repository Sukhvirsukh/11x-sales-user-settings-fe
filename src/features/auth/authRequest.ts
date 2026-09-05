const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
export const AUTH_TOKEN_STORAGE_KEY = "vitalb.jwt";

type ApiErrorResponse = {
    message?: string | string[];
};

type AuthApiResponse = {
    accessToken?: string;
    access_token?: string;
    token?: string;
    jwt?: string;
    user?: AuthApiUser;
    data?: AuthApiResponse;
};

type AuthApiUser = {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    username?: string;
    email?: string;
};

export interface AuthUser {
    id?: string;
    name: string;
    email?: string;
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

function getAccessToken(response: AuthApiResponse) {
    return (
        response.accessToken ??
        response.access_token ??
        response.token ??
        response.jwt ??
        (response.data ? getAccessToken(response.data) : undefined)
    );
}

function getUser(response: AuthApiResponse): AuthUser | undefined {
    const user = response.user ?? response.data?.user;
    if (!user) return undefined;

    const name = user.name ?? user.fullName ?? user.username;
    if (!name) return undefined;

    return {
        id: user.id ?? user._id,
        name,
        email: user.email,
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

    const accessToken = getAccessToken(body as AuthApiResponse);
    if (!accessToken) {
        throw new Error("Authentication response did not include a JWT.");
    }

    return { accessToken, user: getUser(body as AuthApiResponse) };
}
