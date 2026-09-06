import { InputField } from "@/components/design/InputField";
import { AuthForm, authInputClassName } from "../auth";
import { Mail } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
    return (
        <AuthForm
            title="Welcome back to Vitalb"
            subtitle="Sign in to manage your AI agents, databases, and workspace."
            withSocials={false}
        >
            <form
                // onSubmit={handleSubmit(signIn)}
                className="flex flex-col"
                noValidate
            >
                <div className="flex flex-col gap-2.5">
                    <InputField
                        type="email"
                        placeholder="Email ID"
                        autoComplete="email"
                        // error={errors.email?.message}
                        containerClassName={authInputClassName}
                        startIcon={<Mail className="size-3" />}
                    // {...register("email")}
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
                // disabled={signInMutation.isPending}
                >
                    Forget Password
                </Button>
            </form>
        </AuthForm>
    )
}
