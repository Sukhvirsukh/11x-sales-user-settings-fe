import { useMutation } from "@tanstack/react-query";
import { Check, Mail, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { resendVerificationEmail } from "./emailVerificationApi";
import { formatRemaining, useResendCooldown } from "./useResendCooldown";

export default function EmailVerificationForm() {
    const email = useAuthStore((state) => state.email) ?? "";
    const { isCoolingDown, remainingMs, start } = useResendCooldown(email);

    const resendMutation = useMutation({
        mutationFn: () => resendVerificationEmail(email),
        onSuccess: () => {
            start();
            toast.add({
                type: "success",
                title: "Verification email sent",
                description:
                    "If an account exists for this email, a new verification link is on its way.",
            });
        },
    });

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-10">
            <div className="isolate relative z-10 w-full max-w-[500px]">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-[25px] -bottom-3 z-[-1] h-12 rounded-full bg-primary/20 blur-xl"
                />
                <div className="relative z-0 rounded-[20px] border border-content-strong/5 bg-surface-raised p-7.5 text-center shadow-auth-card dark:border-section-border">
                    {/* Icons on top */}
                    <div className="flex items-center justify-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-interactive-active-background text-primary">
                            <Check className="size-4.5" aria-hidden="true" />
                        </span>
                        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-interactive-active-background text-primary">
                            <Mail className="size-7" aria-hidden="true" />
                            <span className="absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full border-2 border-surface-raised bg-badge-active-background text-badge-active-dot">
                                <Check className="size-3.5" aria-hidden="true" />
                            </span>
                        </span>
                        <span className="flex size-9 items-center justify-center rounded-xl bg-interactive-active-background text-primary">
                            <ShieldCheck
                                className="size-4.5"
                                aria-hidden="true"
                            />
                        </span>
                    </div>

                    <h1 className="mt-6 text-[28px] leading-9 font-semibold tracking-tight text-foreground md:text-[32px] md:leading-10">
                        Check your email
                    </h1>
                    <p className="mx-auto mt-2.5 max-w-sm text-base leading-snug font-normal text-content-muted">
                        We sent a verification link
                        {email ? (
                            <>
                                {" to "}
                                <span className="font-medium text-foreground">
                                    {email}
                                </span>
                            </>
                        ) : null}
                        . Open it to activate your Vitalb account.
                    </p>

                    <Button
                        type="button"
                        className="mt-7.5 w-full"
                        disabled={!email || isCoolingDown || resendMutation.isPending}
                        onClick={() => resendMutation.mutate()}
                    >
                        {resendMutation.isPending
                            ? "Sending email..."
                            : isCoolingDown
                                ? `Resend in ${formatRemaining(remainingMs)}`
                                : "Resend verification email"}
                    </Button>

                    <p className="mt-5 text-sm text-content-muted">
                        Didn't get it? Check your spam folder, or resend it
                        above.
                    </p>
                </div>
            </div>
        </main>
    );
}
