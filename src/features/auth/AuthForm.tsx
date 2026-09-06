import type { AuthFormProps } from "./authTypes";
import googleIcon from "@/assets/auth/google.svg";
import facebookIcon from "@/assets/auth/facebook.svg";
import shopifyIcon from "@/assets/auth/shopify.svg";

const socialProviders = [
    { name: "Google", icon: googleIcon },
    { name: "Facebook", icon: facebookIcon },
    { name: "Shopify", icon: shopifyIcon },
] as const;

export const authInputClassName =
    "h-auto border-transparent bg-black/[0.03] py-2 focus-within:border-transparent focus-within:bg-black/[0.03] focus-within:ring-0";

export default function AuthForm({
    title,
    subtitle,
    children,
    withSocials = true,
}: AuthFormProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
            <div className="w-full max-w-100 rounded-[20px] border border-primary/10 bg-white p-7.5 shadow-auth relative z-10">
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
                        <span className="h-px flex-1 bg-black/10" />
                        <span className="shrink-0 text-sm text-ghost">
                            Or continue with
                        </span>
                        <span className="h-px flex-1 bg-black/10" />
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
        </main>
    );
}
