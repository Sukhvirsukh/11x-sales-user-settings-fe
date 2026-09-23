import CrawlSettings from "./CrawlSettings";
import TrackingSettings from "./TrackingSettings";
import SpamFilter from "./SpamFilter";
import { chatSettingsConfigurationsQueryKey, useConfigurationsQuery } from "../chatSettingsQuery";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Configuration } from "../chatSettingsType";
import { saveConfigurations } from "../chatSettingsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnSavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { toast } from "@/components/ui/toast";
import { useCan } from "@/features/auth";

export type ConfigurationFormValues = Omit<Configuration, "rateLimit" | "rateLimitPerPeriod" | "messageWhenLimitReached"> & {
    rateLimit: string;
    rateLimitPerPeriod: string;
    messageWhenLimitReached: string;
};

const DEFAULT_VALUES: ConfigurationFormValues = {
    ignoreProducts: "out-of-stock",
    ignoreElements: [],
    crawlInterval: "ONE_HOUR",
    rateLimit: "",
    rateLimitPerPeriod: "",
    messageWhenLimitReached: "",
    enableUtmTracking: false,
};

function toFormValues(configuration: Configuration): ConfigurationFormValues {
    return {
        ...configuration,
        ignoreElements: configuration.ignoreElements ?? [],
        rateLimit: configuration.rateLimit?.toString() ?? "",
        rateLimitPerPeriod: configuration.rateLimitPerPeriod?.toString() ?? "",
        messageWhenLimitReached: configuration.messageWhenLimitReached ?? "",
    };
}

function toConfiguration(values: ConfigurationFormValues): Configuration {
    return {
        ...values,
        rateLimit: values.rateLimit ? Number(values.rateLimit) : null,
        rateLimitPerPeriod: values.rateLimitPerPeriod ? Number(values.rateLimitPerPeriod) : null,
        messageWhenLimitReached: values.messageWhenLimitReached || null,
    };
}

export default function Configurations() {
    const { data, isLoading } = useConfigurationsQuery();
    // Saving is a change, so it follows the section's `create` grant. Without it
    // the form stays readable and the Save action is inert — no backend request.
    const canSaveConfigurations = useCan("chatSettings.create");
    const queryClient = useQueryClient();
    const form = useForm<ConfigurationFormValues>({ defaultValues: DEFAULT_VALUES });
    const saveMutation = useMutation({
        mutationFn: (values: Configuration) => {
            // Second gate: even a direct mutate() call must not reach the API.
            if (!canSaveConfigurations) {
                return Promise.reject(new Error("You do not have permission to change chat settings."));
            }
            return saveConfigurations(values);
        },
        onSuccess: (savedConfiguration) => {
            queryClient.setQueryData(chatSettingsConfigurationsQueryKey, savedConfiguration);
            form.reset(toFormValues(savedConfiguration));
            toast.add({
                type: "success",
                title: "Configuration saved",
                description: "Your chat settings have been updated.",
            });
        },
    });

    useEffect(() => {
        if (data) form.reset(toFormValues(data));
    }, [data, form]);

    return (
        <FormProvider {...form}>
            <form className="flex min-w-0 flex-col gap-4" aria-busy={isLoading}>
                <CrawlSettings />
                <TrackingSettings />
                <SpamFilter />
                {canSaveConfigurations && <UnSavedChangesBar
                    isDirty={form.formState.isDirty}
                    saving={saveMutation.isPending}
                    saveDisabled={!canSaveConfigurations}
                    placement="fixed"
                    onSave={async () => {
                        if (!canSaveConfigurations) return;
                        await saveMutation.mutateAsync(toConfiguration(form.getValues()));
                    }}
                    onDiscard={() => form.reset(data ? toFormValues(data) : DEFAULT_VALUES)}
                />}
            </form>
        </FormProvider>
    );
}
