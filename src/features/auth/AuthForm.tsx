import type { AuthFormProps } from "./authTypes";
import { Check } from "lucide-react";
import { BrandIcon, BrandLogo } from "@/components/brand/Brand";
import googleIcon from "@/assets/auth/google.svg";
import facebookIcon from "@/assets/auth/facebook.svg";
import shopifyIcon from "@/assets/auth/shopify.svg";

const socialProviders = [
    { name: "Google", icon: googleIcon },
    { name: "Facebook", icon: facebookIcon },
    { name: "Shopify", icon: shopifyIcon },
] as const;

const proofPoints = [
    "Answers shoppers from your catalog, policies and orders",
    "Recommends products and sends checkout links in chat",
    "Hands the hard conversations to your team",
];

/** The brand side of the sign-in screens: what the product does, shown as a live exchange. */
function BrandPanel() {
    return (
        <aside className="relative hidden overflow-hidden bg-[#131215] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-[#2F87FF] opacity-[0.18] blur-[120px]"
            />
            <BrandLogo className="relative gap-3.5 text-white" markClassName="h-7" wordClassName="text-[22px]" />

            <div className="relative max-w-[440px]">
                <h2 className="font-brand text-[30px] leading-[40px] font-semibold tracking-[-0.03em] text-balance">
                    <span className="text-white/60">Your pipeline,</span>{" "}
                    <span className="font-extrabold">eleven times over.</span>
                </h2>
                <ul className="mt-6 flex flex-col gap-3">
                    {proofPoints.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-[15px] leading-6 text-white/75">
                            <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2F87FF]/20 text-[#5EA2FF]">
                                <Check className="size-3" strokeWidth={3} />
                            </span>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>

            {/* An example exchange, so the panel shows the product instead of describing it. */}
            <div aria-hidden="true" className="relative flex max-w-[440px] flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <p className="self-end rounded-2xl rounded-br-md bg-white px-3.5 py-2 text-sm text-[#16181D]">
                    Do the trail runners come in a size 10?
                </p>
                <div className="flex items-end gap-2">
                    <BrandIcon className="size-6 rounded-md" />
                    <div className="rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2 text-sm text-white/90">
                        Yes — 3 left in size 10. Want me to add a pair to your cart?
                    </div>
                </div>
                <div className="ml-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
                    <span className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-[#2F87FF] to-[#123A73]" />
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">Ridgeline Trail Runner</span>
                        <span className="block text-xs text-white/60">Size 10 · In stock</span>
                    </span>
                    <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-[#16181D]">Checkout</span>
                </div>
            </div>
        </aside>
    );
}

export default function AuthForm({
    title,
    subtitle,
    children,
    withSocials = false,
}: AuthFormProps) {
    return (
        <main className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <BrandPanel />

            <section className="flex min-h-dvh flex-col px-5 py-8 sm:px-10">
                <div className="lg:hidden">
                    <BrandLogo />
                </div>

                <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
                    <h1 className="font-display text-[28px] leading-9 font-semibold tracking-[-0.025em] text-foreground">
                        {title}
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>

                    <div className="mt-8">{children}</div>

                    {withSocials && (
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex w-full items-center gap-3">
                                <span className="h-px flex-1 bg-border" />
                                <span className="shrink-0 text-sm text-muted-foreground">Or continue with</span>
                                <span className="h-px flex-1 bg-border" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {socialProviders.map((provider) => (
                                    <button
                                        key={provider.name}
                                        type="button"
                                        aria-label={`Continue with ${provider.name}`}
                                        className="flex h-10 items-center justify-center rounded-lg border border-border bg-surface-raised transition-colors hover:bg-control-hover"
                                    >
                                        <img src={provider.icon} alt="" width={18} height={18} className="size-4.5 object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-sm text-muted-foreground lg:text-left">© {new Date().getFullYear()} 11xsales.ai</p>
            </section>
        </main>
    );
}
