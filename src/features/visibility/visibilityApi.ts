import { apiFetch } from "@/lib/api";
import type { VisibilityFields } from "./visibilityTypes";

export function getVisibility(): Promise<VisibilityFields> {
    return apiFetch<VisibilityFields>("/chat-design");
}
