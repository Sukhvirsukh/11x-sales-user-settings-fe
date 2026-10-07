import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { AuthForm } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { signUpSchema } from "./signUpSchema";
import type { SignUpFormValues } from "./signUpTypes";
import { signUpRequest } from "./signUpApi";
import { storeAuthToken } from "@/features/auth/authStorage";
import { useAuthStore } from "@/features/auth/authStore";

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const signUpMutation = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (auth) => {
            storeAuthToken(auth.accessToken, auth.refreshToken);
            setUser(auth.user);
            toast.add({
                type: "success",
                title: "Account created",
                description: "We sent you a link to confirm your email.",
            });
            navigate("/");
        },

    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    function signUp(values: SignUpFormValues) {
        signUpMutation.mutate(values);
    }

    return (
        <AuthForm
            withSocials
            title="Create your account"
            subtitle="Set up an AI sales agent for your store in a few minutes."
        >
            <form
                onSubmit={handleSubmit(signUp)}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-4">
                    <InputField
                        type="text"
                        label="Name"
                        placeholder="Your name"
                        autoComplete="name"
                        error={errors.name?.message}
                        startIcon={<User />}
                        {...register("name")}
                    />

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
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
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

                </div>

                <Button
                    type="submit"
                    size="full"
                    className="mt-6"
                    disabled={signUpMutation.isPending}
                >
                    {signUpMutation.isPending ? "Creating account…" : "Create account"}
                </Button>

                <p className="mt-6 text-center text-base text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="font-medium text-foreground underline underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthForm>
    );
}
