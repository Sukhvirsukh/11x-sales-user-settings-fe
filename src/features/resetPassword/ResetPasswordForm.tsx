import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AuthForm } from "@/features/auth";
import { resetPasswordRequest } from "./resetPasswordApi";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "./resetPasswordSchema";

const MAX_TOKEN_LENGTH = 4096;

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState(false);
    const [token] = useState(
        () => new URLSearchParams(window.location.search).get("token")?.trim() ?? "",
    );
    const hasValidToken = token.length > 0 && token.length <= MAX_TOKEN_LENGTH;

    useEffect(() => {
        if (!window.location.search) return;

        window.history.replaceState(
            window.history.state,
            "",
            `${window.location.pathname}${window.location.hash}`,
        );
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (values: ResetPasswordFormValues) =>
            resetPasswordRequest({ token, newPassword: values.password }),
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Password reset",
                description: "Your password has been updated. You can now sign in.",
            });
            navigate("/sign-in", { replace: true });
        },
    });

    const passwordType = showPasswords ? "text" : "password";
    const visibilityLabel = showPasswords ? "Hide passwords" : "Show passwords";
    const visibilityControl = (
        <button
            type="button"
            onClick={() => setShowPasswords((current) => !current)}
            className="text-content-muted transition-colors hover:text-foreground"
            aria-label={visibilityLabel}
        >
            {showPasswords ? (
                <Eye className="size-4" aria-hidden="true" />
            ) : (
                <EyeOff className="size-4" aria-hidden="true" />
            )}
        </button>
    );

    return (
        <AuthForm
            title="Choose a password"
            subtitle={
                hasValidToken
                    ? "Set the password you'll use to sign in to 11xSales."
                    : "This link is invalid or incomplete. Ask for a new one below."
            }
            withSocials={false}
        >
            <form
                className="flex flex-col"
                onSubmit={handleSubmit((values) => resetPasswordMutation.mutate(values))}
                noValidate
            >
                <div className="flex flex-col gap-4">
                    <InputField
                        type={passwordType}
                        label="New password"
                        placeholder="New password"
                        autoComplete="new-password"
                        maxLength={128}
                        error={errors.password?.message}
                        startIcon={<LockKeyhole aria-hidden="true" />}
                        endIcon={visibilityControl}
                        {...register("password")}
                    />

                    <InputField
                        type={passwordType}
                        label="Confirm password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        maxLength={128}
                        error={errors.confirmPassword?.message}
                        startIcon={<LockKeyhole aria-hidden="true" />}
                        endIcon={visibilityControl}
                        {...register("confirmPassword")}
                    />
                </div>

                <Button
                    type="submit"
                    size="full"
                    className="mt-6"
                    disabled={!hasValidToken || resetPasswordMutation.isPending}
                >
                    {resetPasswordMutation.isPending ? "Saving…" : "Save password"}
                </Button>

                <p className="mt-6 text-center text-base text-muted-foreground">
                    {hasValidToken ? "Have an account? " : "Need a new link? "}
                    <Link
                        to={hasValidToken ? "/sign-in" : "/forgot-password"}
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        {hasValidToken ? "Sign in" : "Send me one"}
                    </Link>
                </p>
            </form>
        </AuthForm>
    );
}
