import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import InfoModal from "@/components/shared/InfoModal";
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

            <InfoModal
                open={open}
                onOpenChange={(nextOpen) => {
                    if (!resetMutation.isPending) setOpen(nextOpen);
                }}
                title="Reset visibility settings"
                description="Are you sure you want to proceed with new settings?"
                confirmLabel={resetMutation.isPending ? "Resetting..." : "Yes sure"}
                cancelLabel="Cancel"
                confirmDisabled={resetMutation.isPending}
                cancelDisabled={resetMutation.isPending}
                onConfirm={() => resetMutation.mutate()}
            />
        </>
    );
}
