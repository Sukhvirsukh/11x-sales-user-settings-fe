export const AUTH_TOKEN_STORAGE_KEY = "vitalb.jwt";
const REFRESH_TOKEN_STORAGE_KEY = "vitalb.refresh";
const CURRENT_AGENT_STORAGE_KEY = "vitalb.agent";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function storeAuthToken(token: string, refreshToken?: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(CURRENT_AGENT_STORAGE_KEY);
}

/** The agent (store) the user last chose in the switcher, kept across reloads. */
export function getStoredAgentId() {
  return localStorage.getItem(CURRENT_AGENT_STORAGE_KEY);
}

export function storeAgentId(agentId: string | null) {
  if (agentId) localStorage.setItem(CURRENT_AGENT_STORAGE_KEY, agentId);
  else localStorage.removeItem(CURRENT_AGENT_STORAGE_KEY);
}
