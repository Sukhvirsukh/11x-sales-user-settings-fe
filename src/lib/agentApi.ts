import { toast } from "@/components/ui/toast";

// The AI agent service. It accepts the same sign-in token as the main API
// and works on the signed-in user's store ("me").
const AGENT_API_BASE_URL = (import.meta.env.VITE_AGENT_API_BASE_URL ?? "").replace(/\/$/, "");
const AUTH_TOKEN_STORAGE_KEY = "vitalb.jwt";

export const agentApiConfigured = AGENT_API_BASE_URL !== "";

interface AgentFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Show a toast when the request fails (default: true). */
  notifyOnError?: boolean;
}

export async function agentFetch<T>(path: string, options: AgentFetchOptions = {}): Promise<T> {
  const { body, notifyOnError = true, ...init } = options;
  if (!agentApiConfigured) throw new Error("The AI agent service isn't configured (VITE_AGENT_API_BASE_URL).");

  const headers = new Headers(init.headers);
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${AGENT_API_BASE_URL}/admin/api/me${path}`, {
    ...init,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data && typeof data === "object" && "error" in data && String(data.error)) || `Request failed (${response.status})`;
    if (notifyOnError) toast.add({ type: "error", title: "AI agent", description: message });
    throw new Error(message);
  }

  return (await response.json()) as T;
}
