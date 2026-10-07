import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, apiUrl } from "@/lib/api";
import googleIcon from "@/assets/auth/google.svg";
import facebookIcon from "@/assets/auth/facebook.svg";
import shopifyIcon from "@/assets/auth/shopify.svg";

type Provider = "google" | "facebook" | "shopify";

const PROVIDERS: Record<Provider, { label: string; icon: string }> = {
    google: { label: "Continue with Google", icon: googleIcon },
    facebook: { label: "Continue with Facebook", icon: facebookIcon },
    shopify: { label: "Continue with Shopify", icon: shopifyIcon },
};
const ORDER: Provider[] = ["google", "shopify", "facebook"];

/** Leaves for the provider's consent screen; the backend runs the exchange and returns to /auth/callback. */
function startSignIn(provider: Provider, shop?: string) {
    const query = shop ? `?${new URLSearchParams({ shop })}` : "";
    window.location.assign(apiUrl(`/auth/oauth/${provider}/start${query}`));
}

const buttonClass =
    "flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-surface-raised text-base font-medium text-foreground shadow-panel transition-colors hover:border-border-strong hover:bg-control-hover disabled:opacity-60";

/**
 * Google, Shopify and Facebook sign-in. Only providers the server has keys for are
 * shown; with none configured this renders nothing, divider included.
 */
export default function SocialSignIn() {
    const { data } = useQuery({
        queryKey: ["auth", "oauthProviders"],
        queryFn: () => apiFetch<{ providers: Provider[] }>("/auth/oauth/providers", { auth: false, notifyOnError: false }),
        staleTime: 5 * 60 * 1000,
    });
    const [leaving, setLeaving] = useState<Provider | null>(null);
    const [askShop, setAskShop] = useState(false);
    const [shop, setShop] = useState("");

    const enabled = ORDER.filter((p) => data?.providers.includes(p));
    if (!enabled.length) return null;

    function go(provider: Provider, shopDomain?: string) {
        setLeaving(provider);
        startSignIn(provider, shopDomain);
    }

    function submitShop(event: React.FormEvent) {
        event.preventDefault();
        const name = shop.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        if (!name) return;
        go("shopify", name.includes(".") ? name : `${name}.myshopify.com`);
    }

    return (
        <div className="flex flex-col gap-2.5">
            {enabled.map((provider) =>
                provider === "shopify" && askShop ? (
                    <form key={provider} onSubmit={submitShop} className="flex flex-col gap-2 rounded-lg border border-border bg-surface-subtle p-3">
                        <label htmlFor="shopify-store" className="text-[13px] font-medium text-foreground">
                            Your Shopify store
                        </label>
                        <div className="flex gap-2">
                            <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-field-border bg-surface-raised px-3 focus-within:border-foreground/60 focus-within:ring-3 focus-within:ring-focus-ring/15">
                                <input
                                    id="shopify-store"
                                    autoFocus
                                    value={shop}
                                    onChange={(event) => setShop(event.target.value)}
                                    placeholder="your-store"
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="min-w-0 flex-1 bg-transparent text-base text-field-text outline-none placeholder:text-placeholder"
                                />
                                {!shop.includes(".") && <span className="shrink-0 text-sm text-muted-foreground">.myshopify.com</span>}
                            </div>
                            <Button type="submit" size="icon" className="size-10" disabled={!shop.trim() || leaving !== null} aria-label="Continue to Shopify">
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">We'll connect your store too, so your agent can start selling.</p>
                    </form>
                ) : (
                    <button
                        key={provider}
                        type="button"
                        className={buttonClass}
                        disabled={leaving !== null}
                        onClick={() => (provider === "shopify" ? setAskShop(true) : go(provider))}
                    >
                        <img src={PROVIDERS[provider].icon} alt="" width={18} height={18} className="size-[18px] object-contain" />
                        {leaving === provider ? "Redirecting…" : PROVIDERS[provider].label}
                    </button>
                ),
            )}
            <div className="mt-3 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="shrink-0 text-sm text-muted-foreground">or with email</span>
                <span className="h-px flex-1 bg-border" />
            </div>
        </div>
    );
}
