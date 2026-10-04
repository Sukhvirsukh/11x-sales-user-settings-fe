import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CircleCheck, CircleAlert, Mail } from "lucide-react";
import { AuthForm } from "@/features/auth";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getAuthToken } from "@/features/auth/authStorage";
import { apiFetch } from "@/lib/api";

type Status = "verifying" | "verified" | "failed";

/** Where the confirmation email lands: confirms the address, or offers a fresh link. */
export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const token = params.get("token") ?? "";
    const [status, setStatus] = useState<Status>(token ? "verifying" : "failed");
    const [email, setEmail] = useState("");
    const [resend, setResend] = useState<"idle" | "sending" | "sent">("idle");
    const started = useRef(false);
    const signedIn = Boolean(getAuthToken());

    useEffect(() => {
        // Tokens are single-use, so StrictMode's double effect must not spend it twice.
        if (!token || started.current) return;
        started.current = true;
        apiFetch("/auth/verify-email", {
            method: "POST",
            auth: false,
            notifyOnError: false,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then(() => setStatus("verified"))
            .catch(() => setStatus("failed"));
    }, [token]);

    async function sendNewLink(event: React.FormEvent) {
        event.preventDefault();
        if (!email.trim()) return;
        setResend("sending");
        try {
            await apiFetch("/auth/resend-verification", {
                method: "POST",
                auth: false,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            setResend("sent");
        } catch {
            setResend("idle");
        }
    }

    if (status === "verifying") {
        return (
            <AuthForm title="Confirming your email" subtitle="This only takes a moment.">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-4 text-base text-muted-foreground">
                    <Spinner className="size-5 text-brand" />
                    Checking your link…
                </div>
            </AuthForm>
        );
    }

    if (status === "verified") {
        return (
            <AuthForm title="Email confirmed" subtitle="Thanks — your 11xsales.ai account is fully set up.">
                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4">
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                    <p className="text-base text-foreground">You can now invite your team and connect your store.</p>
                </div>
                <Button size="full" className="mt-6" nativeButton={false} render={<Link to={signedIn ? "/" : "/sign-in"} />}>
                    {signedIn ? "Go to dashboard" : "Sign in"}
                </Button>
            </AuthForm>
        );
    }

    return (
        <AuthForm title="This link didn't work" subtitle="It may have expired or already been used. We can send you a new one.">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
                <p className="text-base text-foreground">Confirmation links last a limited time and work once.</p>
            </div>

            {resend === "sent" ? (
                <p className="mt-6 rounded-xl bg-success-surface p-4 text-base text-success-strong">
                    If that email has an unconfirmed account, a new link is on its way.
                </p>
            ) : (
                <form onSubmit={sendNewLink} className="mt-6 flex flex-col gap-4" noValidate>
                    <InputField
                        type="email"
                        label="Email"
                        placeholder="you@store.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        startIcon={<Mail />}
                    />
                    <Button type="submit" size="full" disabled={resend === "sending" || !email.trim()}>
                        {resend === "sending" ? "Sending…" : "Send a new link"}
                    </Button>
                </form>
            )}

            <p className="mt-6 text-center text-base text-muted-foreground">
                <Link to={signedIn ? "/" : "/sign-in"} className="font-medium text-foreground underline underline-offset-4">
                    {signedIn ? "Back to dashboard" : "Back to sign in"}
                </Link>
            </p>
        </AuthForm>
    );
}
