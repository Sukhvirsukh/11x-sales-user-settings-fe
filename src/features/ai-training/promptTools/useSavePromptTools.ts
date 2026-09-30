import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { toast } from "@/components/ui/toast";
import { useCan } from "@/features/auth";

import { promptToolsQueryKey } from "./promptQuery";
import { savePromptTools, toFormValues } from "./promptToolsApi";
import type { PromptToolsFormValues } from "./promptType";

/**
 * Persists the prompt-tools document.
 *
 * The PUT replaces the whole document, so every editor — the prompt modal and
 * each tool dialog — calls this and sends the document it built. Each caller
 * gets its own mutation, so "Saving..." stays scoped to the dialog that
 * triggered the save.
 */
export function useSavePromptTools() {
    const { reset } = useFormContext<PromptToolsFormValues>();
    const queryClient = useQueryClient();
    const canSave = useCan("aiTraining.create");

    const mutation = useMutation({
        mutationFn: (values: PromptToolsFormValues) => {
            if (!canSave) {
                return Promise.reject(new Error("You do not have permission to change prompt tools."));
            }
            return savePromptTools(values);
        },
        onSuccess: (saved) => {
            queryClient.setQueryData(promptToolsQueryKey, saved);
            reset(toFormValues(saved));
            toast.add({
                type: "success",
                title: "Prompt tools saved",
                description: "Your prompt tools have been updated.",
            });
        },
        onError: (error: Error) => {
            toast.add({
                type: "error",
                title: "Unable to save prompt tools",
                description: error.message,
            });
        },
    });

    return {
        /** Resolves `true` only when the document was saved; failures are toasted. */
        save: async (values: PromptToolsFormValues) => {
            try {
                await mutation.mutateAsync(values);
                return true;
            } catch {
                return false;
            }
        },
        saving: mutation.isPending,
        canSave,
    };
}
