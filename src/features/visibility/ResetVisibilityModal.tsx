import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/design/Banner";
import Modal from "@/components/design/Modal";
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
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!resetMutation.isPending) setOpen(nextOpen);
            }}
            trigger={
                <Button variant="secondary" size="full">
                    Reset to default
                </Button>
            }
            title="Reset visibility settings"
            primaryAction={{
                label: resetMutation.isPending ? "Resetting..." : "Reset to default",
                onClick: () => resetMutation.mutate(),
                disabled: resetMutation.isPending,
                variant: "destructive",
            }}
            closeAction={{
                label: "Cancel",
                disabled: resetMutation.isPending,
            }}
        >
            <Banner variant="warning" isIcon>
                <p>
                    Are you sure you want to reset all visibility settings to their defaults?
                    Your current settings will be replaced.
                </p>
            </Banner>
        </Modal>
    );
}
