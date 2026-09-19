import type { AuthFormProps } from "./authTypes";
import googleIcon from "@/assets/auth/google.svg";
import facebookIcon from "@/assets/auth/facebook.svg";
import shopifyIcon from "@/assets/auth/shopify.svg";

const socialProviders = [
    { name: "Google", icon: googleIcon },
    { name: "Facebook", icon: facebookIcon },
    { name: "Shopify", icon: shopifyIcon },
] as const;


export default function AuthForm({
    title,
    subtitle,
    children,
    withSocials = false,
}: AuthFormProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-table-header-background px-4 py-10">
            <div className="isolate relative z-10 w-full max-w-[500px]">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-[25px] -bottom-3 z-[-1] h-12 rounded-full bg-primary/20 blur-xl"
                />
                <div className="relative z-0 rounded-[20px] border border-content-strong/5 bg-white p-7.5 shadow-[0_0_4px_rgb(0_0_0/0.12)] dark:border-section-border dark:bg-surface-raised dark:shadow-auth">
                <div className="flex items-center justify-center gap-2">
                    <img
                        src="/logo.svg"
                        alt=""
                        className="size-7 object-contain"
                    />
                    <p className="font-medium">Vitlab</p>
                </div>
                <div className="text-center">
                    <h1 className="text-[28px] leading-9 font-semibold tracking-tight text-foreground md:text-[32px] md:leading-10">
                        {title}
                    </h1>
                    <p className="mt-2.5 mb-1.5 text-base leading-snug font-normal">
                        {subtitle}
                    </p>
                </div>

                <div className="mt-7.5">{children}</div>

                {withSocials && <div className="mt-7.5 flex flex-col items-center gap-5">
                    <div className="flex w-full items-center gap-3">
                        <span className="h-px flex-1 bg-content-strong/10" />
                        <span className="shrink-0 text-sm text-content-muted">
                            Or continue with
                        </span>
                        <span className="h-px flex-1 bg-content-strong/10" />
                    </div>

                    <div className="flex items-center gap-8">
                        {socialProviders.map((provider) => (
                            <button
                                key={provider.name}
                                type="button"
                                aria-label={`Continue with ${provider.name}`}
                                className="inline-flex size-4.5 items-center justify-center transition-opacity hover:opacity-80"
                            >
                                <img
                                    src={provider.icon}
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="size-4.5 object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>}
                </div>
            </div>
        </main>
    );
}
