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
            subtitle="Enter your email and we'll send you instructions to reset your password."
            withSocials={false}
        >
            <form
                onSubmit={handleSubmit((values) => forgotPasswordMutation.mutate(values))}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-2.5">
                    <InputField
                        type="email"
                        label="Email"
                        labelClassName="text-sm font-medium"
                        placeholder="Email"
                        autoComplete="email"
                        error={errors.email?.message}
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
                        ? "Sending instructions..."
                        : "Send reset instructions"}
                </Button>
            </form>
        </AuthForm>
    );
}
