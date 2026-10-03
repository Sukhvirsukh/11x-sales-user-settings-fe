import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ExpandableCheckboxField from "@/components/design/ExpandableCheckboxField";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { SelectField } from "@/components/design/SelectField";
import FormFieldGroup from "@/components/design/FormFieldGroup";
import { Button } from "@/components/ui/button";
import { registerStepValidator, useOnBoardingStore } from "./onBoardingStore";
import { trainAgentSchema, type TrainAgentFormData } from "./onBoardingSchema";
import { TextAreaField } from "@/components/design/TextAreaField";
import { trainAgent } from "./onBoardingApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";

const languageOptions = [
    { label: "English", value: "english" },
    { label: "French", value: "french" },
    { label: "Spanish", value: "spanish" },
];

const toneOptions = [
    { name: "friendly", label: "Friendly" },
    { name: "professional", label: "Professional" },
    { name: "custom", label: "Custom" },
];

const unexpectedMomentOptions = [
    { name: "handoff-to-human-support", label: "Handoff to human support" },
    { name: "collects-mail", label: "Collects mail" },
    { name: "custom", label: "Custom" },
];

export default function TrainAgent() {
    const { completedSteps, currentStep, goToStep, setCurrentStep, completeStep } = useOnBoardingStore();
    const initialTone = "friendly";
    const initialUnexpectedMoment = "Handoff to human support";
    const [toneChoice, setToneChoice] = useState('friendly');
    const [unexpectedMomentChoice, setUnexpectedMomentChoice] = useState('handoff-to-human-support');
    const { control, handleSubmit, register, trigger, formState: { errors } } = useForm<TrainAgentFormData>({
        resolver: zodResolver(trainAgentSchema),
        defaultValues: {
            agentName: "",
            language: "english",
            tone: initialTone,
            unexpectedMoment: initialUnexpectedMoment,
        },
    });

    useEffect(() => registerStepValidator("train-agent", () => trigger()), [trigger]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: TrainAgentFormData) => trainAgent(data),
        onSuccess: () => {
            completeStep("train-agent")
            setCurrentStep("test-agent")
        },
        onError: () => {
            toast.add({
                type: "error",
                title: "Unable to train agent",
                description: 'Something went wrong. Please try again.',
            })
        },
    })

    return (
        <ExpandableCheckboxField
            id="train-agent"
            label="Train your agent how to behave"
            description="Tell how your agent should behave."
            checked={completedSteps.includes("train-agent")}
            isOpen={currentStep === "train-agent"}
            onCheckedChange={() => { void goToStep("train-agent") }}
        >
            <form onSubmit={handleSubmit((values) => mutate(values))} noValidate>
                <FormGroup gap="sm">
                    <FormGroup gap="sm" col={2}>
                        <InputField
                            label="Agent Name"
                            placeholder="Enter here"
                            labelClassName="text-sm font-medium"
                            error={errors.agentName?.message}
                            {...register("agentName")}
                        />
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <SelectField
                                    label="Language"
                                    placeholder="Select language"
                                    labelClassName="text-sm font-medium"
                                    options={languageOptions}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    error={errors.language?.message}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup gap="sm" col={2}>
                        <Controller
                            name="tone"
                            control={control}
                            render={({ field }) => (
                                <FormFieldGroup
                                    label="Set the tone of the AI agent"
                                    toggles={toneOptions}
                                    pressed={toneChoice}
                                    onPressedChange={(choice) => {
                                        if (!choice) return;
                                        setToneChoice(choice);
                                        field.onChange(choice === "custom" ? "" : choice);
                                    }}
                                    inputDisabled={toneChoice !== "custom"}
                                    inputPlaceholder="Describe a custom tone"
                                    inputValue={toneChoice === "custom" ? field.value : ""}
                                    onChange={field.onChange}
                                    inputError={errors.tone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="unexpectedMoment"
                            control={control}
                            render={({ field }) => (
                                <FormFieldGroup
                                    label="In unexpected moments"
                                    toggles={unexpectedMomentOptions}
                                    pressed={unexpectedMomentChoice}
                                    onPressedChange={(choice) => {
                                        if (!choice) return;
                                        setUnexpectedMomentChoice(choice);
                                        field.onChange(choice === "custom" ? "" : choice);
                                    }}
                                    inputDisabled={unexpectedMomentChoice !== "custom"}
                                    inputPlaceholder="Describe a custom response"
                                    inputValue={unexpectedMomentChoice === "custom" ? field.value : ""}
                                    onChange={field.onChange}
                                    inputError={errors.unexpectedMoment?.message}
                                />
                            )}
                        />
                    </FormGroup>
                    <TextAreaField
                        label="Additional infomation"
                        placeholder="Enter here"
                        labelClassName="text-sm font-medium"
                        error={errors.additionalInfo?.message}
                        {...register("additionalInfo")}
                    />
                    <div className="ml-auto">
                        <Button type="submit" variant="primary">
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </FormGroup>
            </form>
        </ExpandableCheckboxField>
    );
}
