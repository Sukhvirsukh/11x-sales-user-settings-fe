import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { resetToDefault } from "./visibilityApi";
import { visibilityQueryKey } from "./visibilityQuery";
import type { VisibilityFields } from "./visibilityTypes";

export default function ResetVisibilityModal() {
    const [open, setOpen] = useState(false);
    const form = useFormContext<VisibilityFields>();
    const queryClient = useQueryClient();
    const resetMutation = useMutation({
        mutationFn: resetToDefault,
        onSuccess: (defaultData) => {
            queryClient.setQueryData(visibilityQueryKey, defaultData);
            form.reset(defaultData);
            form.clearErrors();
            setOpen(false);
        },
    });

    return (
        <>
            <Button
                variant="outline"
                size="full"
                onClick={() => setOpen(true)}
            >
                Reset to default
            </Button>

            <ConfirmationModal
                open={open}
                onOpenChange={setOpen}
                title="Default settings"
                description="Reset visibility settings to their defaults?"
                confirmLabel={resetMutation.isPending ? "Resetting..." : "Yes sure"}
                isPending={resetMutation.isPending}
                onConfirm={() => resetMutation.mutate()}
            />
        </>
    );
}
