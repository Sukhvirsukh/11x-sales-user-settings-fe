import { toast } from "@/components/ui/toast";

const API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
const AUTH_TOKEN_STORAGE_KEY = "vitalb.jwt";

interface ApiFetchOptions extends RequestInit {
  /** Set to false to skip attaching the Bearer token (default: true) */
  auth?: boolean;
}

interface ApiSuccessResponse {
  success?: boolean;
  message?: string;
}

function isApiSuccessResponse(body: unknown): body is ApiSuccessResponse {
  return typeof body === "object" && body !== null;
}

export async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
  const { auth = true, ...init } = options ?? {};

  const headers = new Headers(init.headers);

  if (auth) {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, { ...init, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body && typeof body === "object" && "message" in body
        ? (body as { message: string | string[] }).message
        : undefined;

    const errorMessage = Array.isArray(message)
      ? message.join(" ")
      : message ?? `Request failed (${response.status})`;

    toast.add({
      type: "error",
      title: "Request failed",
      description: errorMessage,
    });

    throw new Error(errorMessage);
  }

  const body = await response.json() as T;

  // if (isApiSuccessResponse(body) && body.success && body.message) {
  //   toast.add({
  //     type: "success",
  //     title: "Success",
  //     description: body.message,
  //   });
  // }

  return body;
}
