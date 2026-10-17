import { apiFetch } from "@/lib/api";
import { createAgent } from "@/features/agents/agentsApi";
import { useAgentStore } from "@/features/agents/agentStore";
import { getStoredAgentId, storeAuthToken } from "./authStorage";
import type { AgentRole, ApiAgent, ApiSession, ApiUser, AuthResponse, AuthUser } from "./authTypes";

// The backend gives a role per agent; the dashboard's permission sets are keyed by these names.
const ROLE_BY_AGENT_ROLE: Record<AgentRole, string> = { owner: "ADMIN", editor: "EDITOR", member: "MEMBER" };

/** The dashboard role for someone with this role on an agent. */
export function roleForAgent(agent: ApiAgent) {
  return ROLE_BY_AGENT_ROLE[agent.role] ?? "MEMBER";
}

function roleFor(user: ApiUser, agent: ApiAgent | null) {
  if (agent) return roleForAgent(agent);
  // No agent yet: an account owner (no inviting admin) can do everything.
  return user.adminId ? "MEMBER" : "ADMIN";
}

export function toAuthUser(user: ApiUser, agent: ApiAgent | null): AuthUser {
  return {
    id: user.id,
    name: user.name?.trim() || user.email,
    email: user.email,
    phone: user.phone ?? undefined,
    role: roleFor(user, agent),
  };
}

/**
 * Takes a session from the backend and makes it the dashboard's: picks the
 * agent to show (the one chosen last on this device, else the backend's
 * current agent), and gives a brand-new account its first agent.
 */
export async function applySession(session: ApiSession): Promise<AuthUser> {
  let agents = session.agents;
  if (!agents.length && !session.user.adminId) {
    agents = [await createAgent(`${session.user.name?.trim() || "My"}'s store`)];
  }
  const stored = getStoredAgentId();
  const current = agents.find((a) => a.id === stored) ?? agents.find((a) => a.id === session.currentAgent?.id) ?? agents[0] ?? null;
  useAgentStore.getState().setAgents(agents, current?.id ?? null);
  return toAuthUser(session.user, current);
}

export async function authRequest<TValues>(endpoint: string, values: TValues): Promise<AuthResponse> {
  const session = await apiFetch<ApiSession>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    auth: false,
  });
  if (!session?.accessToken) {
    throw new Error("Authentication response did not include a token.");
  }
  // Store the tokens first: creating a first agent needs them.
  storeAuthToken(session.accessToken, session.refreshToken);
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    user: await applySession(session),
  };
}

let pendingAuthRefresh: Promise<AuthUser> | null = null;

/** Restores the signed-in user (and their agents) after a page reload. */
export function authRefreshRequest(): Promise<AuthUser> {
  if (pendingAuthRefresh) return pendingAuthRefresh;
  pendingAuthRefresh = apiFetch<ApiSession>("/auth/me", { notifyOnError: false })
    .then((session) => {
      if (!session?.user) throw new Error("Profile response did not include a user.");
      return applySession(session);
    })
    .finally(() => {
      pendingAuthRefresh = null;
    });
  return pendingAuthRefresh;
}
