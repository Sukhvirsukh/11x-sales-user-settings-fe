import { agentFetch } from "@/lib/agentApi";

export interface AskThread {
    id: string;
    title: string;
    updatedAt: string;
}

export interface AskMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export const askThreadsQueryKey = ["askMe", "threads"] as const;
export const askThreadQueryKey = (id: string) => ["askMe", "thread", id] as const;

export function getThreads() {
    return agentFetch<AskThread[]>("/assistant/threads");
}

export function getThread(id: string) {
    return agentFetch<AskMessage[]>(`/assistant/threads/${encodeURIComponent(id)}`);
}

export function ask(text: string, threadId: string | null) {
    return agentFetch<{ threadId: string; reply: string }>("/assistant", { method: "POST", body: { text, threadId } });
}

export function deleteThread(id: string) {
    return agentFetch<{ deleted: number }>(`/assistant/threads/${encodeURIComponent(id)}`, { method: "DELETE" });
}
