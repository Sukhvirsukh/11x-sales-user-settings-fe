import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, User } from "lucide-react";
import { AuthForm, authInputClassName } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { resetPasswordSchema } from "./resetPasswordSchema";
import type { ResetPasswordFormValues } from "./resetPasswordTypes";
import { resetPasswordRequest } from "./resetPasswordApi";

export function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const resetPasswordMutation = useMutation({
        mutationFn: ({ password }: ResetPasswordFormValues) =>
            resetPasswordRequest({ token, password }),
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Password reset",
                description:
                    "Your password has been updated. Sign in with your new password.",
            });
            navigate("/sign-in");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    function onSubmit(values: ResetPasswordFormValues) {
        resetPasswordMutation.mutate(values);
    }

    return (
        <AuthForm
            title="Reset your password"
            subtitle="Enter a new password for your Vitalb account."
            withSocials={false}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-2.5">
                    <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        containerClassName={authInputClassName}
                        startIcon={<User className="size-3" />}
                        endIcon={
                            <Button
                                type="button"
                                variant="bare"
                                size={null}
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-ghost transition-colors hover:text-foreground"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <Eye className="size-4.5" />
                                ) : (
                                    <EyeOff className="size-4.5" />
                                )}
                            </Button>
                        }
                        {...register("password")}
                    />

                    <InputField
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        containerClassName={authInputClassName}
                        startIcon={<User className="size-3" />}
                        endIcon={
                            <Button
                                type="button"
                                variant="bare"
                                size={null}
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                className="text-ghost transition-colors hover:text-foreground"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <Eye className="size-4.5" />
                                ) : (
                                    <EyeOff className="size-4.5" />
                                )}
                            </Button>
                        }
                        {...register("confirmPassword")}
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
                    disabled={resetPasswordMutation.isPending}
                >
                    {resetPasswordMutation.isPending
                        ? "Resetting..."
                        : "Reset Password"}
                </Button>
            </form>
        </AuthForm>
    );
}