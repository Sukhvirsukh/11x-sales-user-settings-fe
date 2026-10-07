import { InputField } from "@/components/design/InputField";
import { AuthForm } from "../auth";
import { Mail } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { forgotPasswordRequest } from "./forgotPasswordApi";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormValues,
} from "./forgotPasswordSchema";

export function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: (values: ForgotPasswordFormValues) =>
            forgotPasswordRequest(values.email),
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Check your email",
                description:
                    "If an account exists for this email, password reset instructions have been sent.",
            });
            reset();
        },
    });

    return (
        <AuthForm
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a link to choose a new one."
            withSocials={false}
        >
            <form
                onSubmit={handleSubmit((values) => forgotPasswordMutation.mutate(values))}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-4">
                    <InputField
                        type="email"
                        label="Email"
                        placeholder="you@store.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        startIcon={<Mail />}
                        {...register("email")}
                    />

                </div>

                <Button
                    type="submit"
                    size="full"
                    className="mt-6"
                    disabled={forgotPasswordMutation.isPending}
                >
                    {forgotPasswordMutation.isPending ? "Sending link…" : "Send reset link"}
                </Button>

                <p className="mt-6 text-center text-base text-muted-foreground">
                    Remembered it?{" "}
                    <Link to="/sign-in" className="font-medium text-foreground underline underline-offset-4">
                        Back to sign in
                    </Link>
                </p>
            </form>
        </AuthForm>
    );
}
