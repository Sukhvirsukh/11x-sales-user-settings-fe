import ExpandableCheckboxField from "@/components/design/ExpandableCheckboxField";
import { registerStepValidator, useOnBoardingStore } from "./onBoardingStore";
import List from "@/components/shared/List";
import { FormGroup } from "@/components/design/FormGroup";
import CopyField from "@/components/shared/CopyField";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../auth";
import { useMutation } from "@tanstack/react-query";
import { completeBoarding } from "./onBoardingApi";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function TestAgent() {
    const { completedSteps, currentStep, goToStep, completeStep } = useOnBoardingStore()
    const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
    const navigate = useNavigate();

    // The test step has no form fields; it is always allowed to be left.
    useEffect(() => registerStepValidator("test-agent", () => Promise.resolve(true)), []);

    const { mutate, isPending } = useMutation({
        mutationFn: completeBoarding,
        onSuccess: () => {
            completeStep("test-agent")
            completeOnboarding();
            navigate("/", { replace: true });
        }
    })

    return (
        <ExpandableCheckboxField
            id="see-agent"
            label="See and test your agent now!"
            description="Check how your agent is working in real time"
            checked={completedSteps.includes("test-agent")}
            isOpen={currentStep === "test-agent"}
            onCheckedChange={() => { void goToStep("test-agent") }}
        >
            <FormGroup gap="sm">
                <List
                    list={[
                        "Ask a question",
                        "See how your agent responds",
                        "See how your agent learns",
                    ]}
                    listClassName="list-disc gap-1 text-sm p-2.5 bg-primary/3 rounded-[10px] m-0 md:m-0 pl-6"
                />
                <div className="flex items-center gap-2">
                    <CopyField value="<iframe=src’https://hhpss.....=" />
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                        variant="ghost"
                    >
                        {isPending ? 'Verifying...' : 'Verify installation'}
                    </Button>
                </div>
                <p className="text-sm text-content-muted text-center pb-0">Please wait for some times, if already added </p>
            </FormGroup>

        </ExpandableCheckboxField>
    )
}
