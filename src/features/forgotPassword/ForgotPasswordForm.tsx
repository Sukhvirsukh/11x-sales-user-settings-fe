import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { AuthForm, authInputClassName } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { forgotPasswordSchema } from "./forgotPasswordSchema";
import type { ForgotPasswordFormValues } from "./forgotPasswordTypes";
import { forgotPasswordRequest } from "./forgotPasswordApi";

export function ForgotPasswordForm() {
    const forgotPasswordMutation = useMutation({
        mutationFn: ({ email }: ForgotPasswordFormValues) =>
            forgotPasswordRequest(email),
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Email sent",
                description: "Check your inbox for the password reset link.",
            });
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    function onSubmit(values: ForgotPasswordFormValues) {
        forgotPasswordMutation.mutate(values);
    }

    return (
        <AuthForm
            title="Welcome back to Vitalb"
            subtitle="Sign in to manage your AI agents, databases, and workspace."
            withSocials={false}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-2.5">
                    <InputField
                        type="email"
                        placeholder="Email ID"
                        autoComplete="email"
                        error={errors.email?.message}
                        containerClassName={authInputClassName}
                        startIcon={<Mail className="size-3" />}
                        {...register("email")}
                    />

                    <p className="text-right text-sm text-ghost">
                        New here?{" "}
                        <Link
                            to="/sign-up"
                            className="font-medium text-ghost underline underline-offset-2"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <Button
                    type="submit"
                    className="mt-7.5 w-full"
                    disabled={forgotPasswordMutation.isPending}
                >
                    {forgotPasswordMutation.isPending
                        ? "Sending..."
                        : "Forget Password"}
                </Button>
            </form>
        </AuthForm>
    );
}
