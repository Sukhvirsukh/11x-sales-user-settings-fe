import { agentFetch } from "@/lib/agentApi";

import type { Correction, CorrectionFormValues } from "./correctionTypes";

// A correction is a question and the answer the AI should give. "Inactive"
// corrections are stored with an expiry in the past, so the agent ignores them.
interface AgentCorrection {
  id: number;
  question: string;
  answer: string;
  expires_at: string | null;
  created_at: string;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(iso));

function toCorrection(row: AgentCorrection): Correction {
  const inactive = row.expires_at !== null && new Date(row.expires_at) <= new Date();
  return {
    id: String(row.id),
    name: row.question,
    corrections: row.answer,
    status: inactive ? "Inactive" : "Active",
    createDate: formatDate(row.created_at),
    lastRefresh: formatDate(row.created_at),
  };
}

export async function getCorrections(): Promise<Correction[]> {
  const rows = await agentFetch<AgentCorrection[]>("/corrections");
  return rows.map(toCorrection);
}

export async function updateCorrection(id: string, values: CorrectionFormValues): Promise<Correction> {
  const row = await agentFetch<AgentCorrection>(`/corrections/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: {
      question: values.name,
      answer: values.corrections,
      expiresAt: values.status === "Inactive" ? new Date().toISOString() : null,
    },
  });
  return toCorrection(row);
}

export async function createCorrection(question: string, answer: string, messageId?: number): Promise<Correction> {
  const row = await agentFetch<AgentCorrection>("/corrections", { method: "POST", body: { question, answer, messageId } });
  return toCorrection(row);
}

export async function deleteCorrections(ids: string[]): Promise<string[]> {
  await Promise.all(ids.map((id) => agentFetch(`/corrections/${encodeURIComponent(id)}`, { method: "DELETE" })));
  return ids;
}
