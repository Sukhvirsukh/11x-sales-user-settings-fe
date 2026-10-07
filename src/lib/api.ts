import { toast } from "@/components/ui/toast";
import { clearAuthToken, getAuthToken, getRefreshToken, storeAuthToken } from "@/features/auth/authStorage";

// The 11xSales backend. Every response is an envelope:
// { success, message, data } on success, { success: false, message, details } on error.
const API_BASE_URL = (import.meta.env.VITE_AUTH_API_BASE_URL ?? "").replace(/\/$/, "");
const API_PREFIX = "/api/v1";

interface ApiFetchOptions extends RequestInit {
  /** Set to false to skip attaching the Bearer token (default: true) */
  auth?: boolean;
  /** Show a toast when the request fails (default: true). */
  notifyOnError?: boolean;
}

type ErrorBody = { message?: string | string[]; details?: { field?: string; message?: string }[] };

function errorMessage(body: ErrorBody, status: number) {
  const details = (body.details ?? []).map((d) => d.message).filter(Boolean);
  if (details.length) return details.join(" ");
  const message = Array.isArray(body.message) ? body.message.join(" ") : body.message;
  return message ?? `Request failed (${status})`;
}

let pendingRefresh: Promise<boolean> | null = null;

/** Swaps the refresh token for a new pair; one refresh at a time however many requests failed. */
function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);
  pendingRefresh ??= fetch(`${API_BASE_URL}${API_PREFIX}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) return false;
      const body = await response.json();
      if (!body?.data?.accessToken) return false;
      storeAuthToken(body.data.accessToken, body.data.refreshToken);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      pendingRefresh = null;
    });
  return pendingRefresh;
}

/** Full address of a backend endpoint, for browser navigations (e.g. social sign-in). */
export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${API_PREFIX}${endpoint}`;
}

export async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
  const { auth = true, notifyOnError = true, ...init } = options ?? {};

  const send = () => {
    const headers = new Headers(init.headers);
    const token = auth ? getAuthToken() : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, { ...init, headers });
  };

  let response = await send();

  // An expired access token: refresh once and retry; if that fails the session is over.
  if (response.status === 401 && auth && getAuthToken()) {
    if (await refreshSession()) {
      response = await send();
    } else {
      clearAuthToken();
      window.location.assign("/sign-in");
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ErrorBody;
    const message = errorMessage(body, response.status);
    if (notifyOnError) {
      toast.add({ type: "error", title: "Request failed", description: message });
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const body = await response.json();
  return (body && typeof body === "object" && "success" in body && "data" in body ? body.data : body) as T;
}
