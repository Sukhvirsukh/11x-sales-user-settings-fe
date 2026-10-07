import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CircleAlert } from "lucide-react";
import { AuthForm } from "@/features/auth";
import { authRequest } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const PROVIDER_NAMES: Record<string, string> = { google: "Google", facebook: "Facebook", shopify: "Shopify" };

/** What to tell the person for each reason the backend can send back. */
function errorMessage(code: string, provider: string): string {
    const name = PROVIDER_NAMES[provider] ?? "That";
    switch (code) {
        case "cancelled":
            return "Sign-in was cancelled.";
        case "expired":
            return "That sign-in took too long, or was started in another browser. Please try again.";
        case "no_email":
            return `${name} didn't share your email address. Allow email access, or sign up with email instead.`;
        case "email_in_use":
            return provider === "shopify"
                ? "An account already uses this store's email. Sign in with your password, then connect the store from Chat setup."
                : `An account with this email already exists. Sign in with your password to keep using it.`;
        case "disabled":
            return "This account has been deactivated. Contact your workspace owner.";
        case "not_configured":
            return `${name} sign-in isn't available yet.`;
        case "invalid_shop":
            return "Enter your store's address, like your-store.myshopify.com.";
        default:
            return `${name} sign-in didn't work. Please try again.`;
    }
}

/** Where Google, Facebook and Shopify sign-in end: swaps the one-time code for a session. */
export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const started = useRef(false);
    const [params] = useState(() => new URLSearchParams(window.location.hash.slice(1)));
    const code = params.get("code");
    const provider = params.get("provider") ?? "";
    const [error, setError] = useState<string | null>(() => (code ? null : params.get("error") ?? "failed"));

    useEffect(() => {
        // The code is single-use and shouldn't linger in history or be shared by copying the URL.
        window.history.replaceState(null, "", window.location.pathname);
        if (!code || started.current) return;
        started.current = true;
        authRequest("/auth/oauth/exchange", { code })
            .then((auth) => {
                setUser(auth.user);
                navigate(provider === "shopify" ? "/chat-settings" : "/", { replace: true });
            })
            .catch(() => setError("expired"));
    }, [code, navigate, provider, setUser]);

    if (!error) {
        return (
            <AuthForm title="Signing you in" subtitle={`Finishing ${PROVIDER_NAMES[provider] ?? ""} sign-in…`}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-4 text-base text-muted-foreground">
                    <Spinner className="size-5 text-brand" />
                    One moment…
                </div>
            </AuthForm>
        );
    }

    return (
        <AuthForm title="Couldn't sign you in" subtitle="Nothing was changed. You can try again or use your email.">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
                <p className="text-base text-foreground">{errorMessage(error, provider)}</p>
            </div>
            <Button size="full" className="mt-6" nativeButton={false} render={<Link to="/sign-in" replace />}>
                Back to sign in
            </Button>
        </AuthForm>
    );
}
