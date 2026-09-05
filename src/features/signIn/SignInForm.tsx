import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { AuthForm, authInputClassName } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { signInSchema, type SignInFormValues } from "./schema";
import { signInRequest } from "./queries/auth";
import { storeAuthToken } from "@/features/auth/authRequest";
import { useAuthStore } from "@/features/auth/storeAuth";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const signInMutation = useMutation({
        mutationFn: signInRequest,
        onSuccess: (auth) => {
            storeAuthToken(auth.accessToken);
            setUser(auth.user);
            toast.add({
                type: "success",
                title: "Signed in successfully",
                description: "Welcome back to Vitalb.",
            });
            navigate("/");
        },
        onError: (error) => {
            toast.add({
                type: "error",
                title: "Sign-in failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Unable to sign in. Please try again.",
            });
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    });

    function signIn(values: SignInFormValues) {
        signInMutation.mutate(values);
    }

    return (
        <AuthForm
            title="Welcome back to Vitalb"
            subtitle="Sign in to manage your AI agents, databases, and workspace."
        >
            <form
                onSubmit={handleSubmit(signIn)}
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

                    <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        containerClassName={authInputClassName}
                        startIcon={<User className="size-3" />}
                        endIcon={
                            <button
                                type="button"
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
                            </button>
                        }
                        {...register("password")}
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
                    disabled={signInMutation.isPending}
                >
                    {signInMutation.isPending ? "Signing in..." : "Proceed"}
                </Button>
            </form>
        </AuthForm>
    );
}
