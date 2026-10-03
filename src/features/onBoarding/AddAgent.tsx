import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ExpandableCheckboxField from "@/components/design/ExpandableCheckboxField";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";

import { registerStepValidator, useOnBoardingStore } from "./onBoardingStore";
import { addAgentSchema, type AddAgentFormData } from "./onBoardingSchema";
import { useMutation } from "@tanstack/react-query";
import { addAgent } from "./onBoardingApi";
import { toast } from "@/components/ui/toast";

export default function AddAgent() {
    const { completedSteps, currentStep, goToStep, setCurrentStep, completeStep } = useOnBoardingStore()
    const { register, handleSubmit, trigger, formState: { errors } } = useForm<AddAgentFormData>({
        resolver: zodResolver(addAgentSchema),
        defaultValues: {
            agentUrl: "",
            gitUrl: "",
            accessToken: "",
        },
    });

    useEffect(() => registerStepValidator("add-agent", () => trigger()), [trigger]);

    const addAgentMutation = useMutation({
        mutationFn: addAgent,
        onSuccess: () => {
            completeStep("add-agent")
            setCurrentStep("train-agent")
        },
        onError: () => {
            toast.add({
                type: "error",
                title: "Unable to add agent",
                description: 'Something went wrong. Please try again.',
            })
        },
    })


    const onCheckedChange = () => {
        void goToStep("add-agent")
    }

    return (
        <ExpandableCheckboxField
            id="added-agent"
            label="Add your first AI agent"
            description="Tell us your agent URL, where the knowledge lives so that we can train your agent’s foundations."
            checked={completedSteps.includes("add-agent")}
            isOpen={currentStep === "add-agent"}
            onCheckedChange={onCheckedChange}
        >
            <form onSubmit={handleSubmit((values) => addAgentMutation.mutate(values))} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Agent URL"
                        placeholder="Enter URL here"
                        labelClassName="text-sm font-medium"
                        error={errors.agentUrl?.message}
                        startIcon={
                            <span className="whitespace-nowrap text-sm">
                                https://
                            </span>
                        }
                        {...register("agentUrl")}
                    />
                    <InputField
                        label={<>Git URL <i>if any</i></>}
                        placeholder="Enter URL here"
                        labelClassName="text-sm font-medium"
                        error={errors.gitUrl?.message}
                        startIcon={
                            <span className="whitespace-nowrap text-sm">
                                https://
                            </span>
                        }
                        {...register("gitUrl")}
                    />
                    <InputField
                        label={<>Access token <i>if any</i></>}
                        placeholder="Enter token here"
                        labelClassName="text-sm font-medium"
                        {...register("accessToken")}
                    />
                    <div className="ml-auto">
                        <Button
                            disabled={addAgentMutation.isPending}
                            type="submit"
                            variant="primary"
                        >
                            {addAgentMutation.isPending ? "Adding agent..." : "Add agent"}
                        </Button>
                    </div>
                </FormGroup>
            </form>
        </ExpandableCheckboxField>
    );
}
