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

export type ConfigurationFormValues = Omit<Configuration, "rateLimit" | "rateLimitPeriodMinutes" | "messageWhenLimitReached"> & {
    rateLimit: string;
    rateLimitPeriodMinutes: string;
    messageWhenLimitReached: string;
};

const DEFAULT_VALUES: ConfigurationFormValues = {
    ignoreOutOfStockProducts: "out-of-stock",
    ignoreElements: [],
    crawlInterval: "ONE_HOUR",
    rateLimit: "",
    rateLimitPeriodMinutes: "",
    messageWhenLimitReached: "",
    enableUtmTracking: false,
};

function toFormValues(configuration: Configuration): ConfigurationFormValues {
    return {
        ...configuration,
        ignoreElements: configuration.ignoreElements ?? [],
        rateLimit: configuration.rateLimit?.toString() ?? "",
        rateLimitPeriodMinutes: configuration.rateLimitPeriodMinutes?.toString() ?? "",
        messageWhenLimitReached: configuration.messageWhenLimitReached ?? "",
    };
}

function toConfiguration(values: ConfigurationFormValues): Configuration {
    return {
        ...values,
        rateLimit: values.rateLimit ? Number(values.rateLimit) : null,
        rateLimitPeriodMinutes: values.rateLimitPeriodMinutes ? Number(values.rateLimitPeriodMinutes) : null,
        messageWhenLimitReached: values.messageWhenLimitReached || null,
    };
}

export default function Configurations() {
    const { data, isLoading } = useConfigurationsQuery();
    const queryClient = useQueryClient();
    const form = useForm<ConfigurationFormValues>({ defaultValues: DEFAULT_VALUES });
    const saveMutation = useMutation({
        mutationFn: saveConfigurations,
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
            <form className="flex min-w-0 flex-col gap-3.5" aria-busy={isLoading}>
                <CrawlSettings />
                <TrackingSettings />
                <SpamFilter />
                <UnSavedChangesBar
                    isDirty={form.formState.isDirty}
                    saving={saveMutation.isPending}
                    placement="fixed"
                    onSave={async () => {
                        await saveMutation.mutateAsync(toConfiguration(form.getValues()));
                    }}
                    onDiscard={() => form.reset(data ? toFormValues(data) : DEFAULT_VALUES)}
                />
            </form>
        </FormProvider>
    );
}
