import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Label from "@/components/design/Label";
import Modal from "@/components/design/Modal";
import { SelectField } from "@/components/design/SelectField";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { segmentFormSchema } from "./contactSchema";
import { createSegment, previewSegment } from "./contactsApi";
import { segmentsQueryKey } from "./contactQuery";
import type { SegmentFormValues, SegmentRules } from "./contactType";

interface AddSegmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: SegmentFormValues = {
    name: "",
    activeSchedule: undefined,
    rules: { who: "everyone", activeWithinDays: null, askedAbout: null, consentOnly: false },
};

const AUDIENCES: { value: SegmentRules["who"]; label: string; hint: string }[] = [
    { value: "everyone", label: "Everyone", hint: "All contacts" },
    { value: "customers", label: "Customers", hint: "Bought through chat" },
    { value: "leads", label: "Leads", hint: "Haven't bought yet" },
];

const RECENCY = [
    { value: "any", label: "Any time" },
    { value: "7", label: "In the last 7 days" },
    { value: "30", label: "In the last 30 days" },
    { value: "90", label: "In the last 90 days" },
    { value: "365", label: "In the last year" },
];

/** Waits until typing settles so the live count isn't re-run on every keystroke. */
function useDebounced<T>(value: T, delay = 350): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function AddSegment({ open, onOpenChange }: AddSegmentProps) {
    const queryClient = useQueryClient();
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<SegmentFormValues>({
        resolver: zodResolver(segmentFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (open) reset(DEFAULT_VALUES);
    }, [open, reset]);

    const rules = useWatch({ control, name: "rules" }) ?? DEFAULT_VALUES.rules;
    const activeSchedule = useWatch({ control, name: "activeSchedule" });
    const previewRules = useDebounced<SegmentRules>({ ...rules, askedAbout: rules.askedAbout?.trim() || null });
    const preview = useQuery({
        queryKey: ["contacts", "segmentPreview", previewRules],
        queryFn: () => previewSegment(previewRules),
        enabled: open,
        staleTime: 30_000,
    });

    const addSegmentMutation = useMutation({
        mutationFn: createSegment,
        onSuccess: async ({ activeUsers }) => {
            await queryClient.invalidateQueries({ queryKey: segmentsQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: "Segment saved",
                description: `${activeUsers} ${activeUsers === 1 ? "contact matches" : "contacts match"} it right now.`,
            });
        },
    });

    function save(values: SegmentFormValues) {
        addSegmentMutation.mutate({
            ...values,
            rules: { ...values.rules, askedAbout: values.rules.askedAbout?.trim() || null },
        });
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="New segment"
            primaryAction={{
                label: addSegmentMutation.isPending ? "Saving…" : "Save segment",
                onClick: handleSubmit(save),
                disabled: addSegmentMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: addSegmentMutation.isPending }}
        >
            <form onSubmit={handleSubmit(save)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="e.g. Repeat buyers this month"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    <div className="flex flex-col gap-1.5">
                        <Label>Who</Label>
                        <Controller
                            control={control}
                            name="rules.who"
                            render={({ field }) => (
                                <div role="radiogroup" aria-label="Who" className="grid grid-cols-3 gap-2">
                                    {AUDIENCES.map((audience) => {
                                        const selected = field.value === audience.value;
                                        return (
                                            <button
                                                key={audience.value}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() => field.onChange(audience.value)}
                                                className={cn(
                                                    "flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                                                    selected
                                                        ? "border-foreground bg-surface-raised shadow-panel"
                                                        : "border-border bg-surface-subtle hover:border-border-strong",
                                                )}
                                            >
                                                <span className="text-base font-medium text-foreground">{audience.label}</span>
                                                <span className="text-sm text-muted-foreground">{audience.hint}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        />
                    </div>

                    <Controller
                        control={control}
                        name="rules.activeWithinDays"
                        render={({ field }) => (
                            <SelectField
                                label="Last chatted"
                                options={RECENCY}
                                value={field.value ? String(field.value) : "any"}
                                onValueChange={(value) => field.onChange(!value || value === "any" ? null : Number(value))}
                            />
                        )}
                    />

                    <InputField
                        label="Asked about (optional)"
                        placeholder="e.g. returns, sizing, gift cards"
                        hint="Matches people who mentioned this in a chat."
                        error={errors.rules?.askedAbout?.message}
                        {...register("rules.askedAbout", { setValueAs: (value: string) => value || null })}
                    />

                    <Controller
                        control={control}
                        name="rules.consentOnly"
                        render={({ field }) => (
                            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-surface-subtle px-3 py-2.5">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                    className="mt-0.5"
                                />
                                <span className="flex flex-col">
                                    <span className="text-base font-medium text-foreground">Marketing consent only</span>
                                    <span className="text-sm text-muted-foreground">Only people who agreed to receive marketing emails.</span>
                                </span>
                            </label>
                        )}
                    />

                    <DatePicker
                        label="Start date (optional)"
                        placeholder="Active straight away"
                        value={activeSchedule}
                        onChange={(date) => setValue("activeSchedule", date ?? undefined, { shouldValidate: true })}
                    />

                    <div
                        aria-live="polite"
                        className="flex items-center gap-2.5 rounded-lg bg-brand-soft px-3 py-2.5 text-base text-foreground"
                    >
                        <Users className="size-4 shrink-0 text-brand" aria-hidden="true" />
                        {preview.isError
                            ? "Couldn't count matching contacts."
                            : preview.data === undefined
                                ? "Counting matching contacts…"
                                : (
                                    <span>
                                        <strong className="tabular font-semibold">{preview.data}</strong>{" "}
                                        {preview.data === 1 ? "contact matches" : "contacts match"} right now
                                    </span>
                                )}
                    </div>
                </FormGroup>
            </form>
        </Modal>
    );
}
