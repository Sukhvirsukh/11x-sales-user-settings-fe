import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { AuthForm } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { signInSchema } from "./signInSchema";
import type { SignInFormValues } from "./signInTypes";
import { signInRequest } from "./signInApi";
import { storeAuthToken } from "@/features/auth/authStorage";
import { useAuthStore } from "@/features/auth/authStore";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const signInMutation = useMutation({
        mutationFn: signInRequest,
        onSuccess: (auth) => {
            storeAuthToken(auth.accessToken, auth.refreshToken);
            setUser(auth.user);
            toast.add({
                type: "success",
                title: "Signed in successfully",
                description: "Welcome back to 11xsales.ai.",
            });
            navigate("/");
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
            withSocials
            title="Sign in"
            subtitle="Welcome back. Pick up where your sales agent left off."
        >
            <form
                onSubmit={handleSubmit(signIn)}
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

                    <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        label="Password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        startIcon={<LockKeyhole />}
                        endIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-content-muted transition-colors hover:text-foreground"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <Eye className="size-4" />
                                ) : (
                                    <EyeOff className="size-4" />
                                )}
                            </button>
                        }
                        {...register("password")}
                    />
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    size="full"
                    className="mt-6"
                    disabled={signInMutation.isPending}
                >
                    {signInMutation.isPending ? "Signing in…" : "Sign in"}
                </Button>

                <p className="mt-6 text-center text-base text-muted-foreground">
                    New to 11xsales.ai?{" "}
                    <Link to="/sign-up" className="font-medium text-foreground underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthForm>
    );
}
