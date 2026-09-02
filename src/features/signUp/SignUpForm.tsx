import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff, Mail, User } from "lucide-react";
import { AuthForm, authInputClassName } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { signUpSchema, type SignUpFormValues } from "./schema";

async function signUp(values: SignUpFormValues) {
    // TODO: call sign-up API
    await Promise.resolve(values);
}

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    return (
        <AuthForm
            title="Build smarter AI with Vitalb"
            subtitle="Sign up in seconds to start building and training your AI agents."
        >
            <form
                onSubmit={handleSubmit(signUp)}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-2.5">
                    <InputField
                        type="text"
                        placeholder="Name"
                        autoComplete="name"
                        error={errors.name?.message}
                        containerClassName={authInputClassName}
                        startIcon={<User className="size-3" />}
                        {...register("name")}
                    />

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
                        autoComplete="new-password"
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
                        Already have an account?{" "}
                        <Link
                            to="/sign-in"
                            className="font-medium text-ghost underline underline-offset-2"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <Button
                    type="submit"
                    className="mt-7.5 w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating account..." : "Proceed"}
                </Button>
            </form>
        </AuthForm>
    );
}
