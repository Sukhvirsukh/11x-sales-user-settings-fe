import { ArrowLeft, Home, ShieldX } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import PreviewSection from "@/components/design/PreviewSection";
import AppSection from "@/components/design/AppSectoin";
import { getHomeRoute } from "@/features/auth/permissions";
import { useRole } from "@/features/auth/usePermissions";

/**
 * Rendered by `RouteGuard` when a route cannot be reached and redirecting would
 * not help — i.e. the role's own home route is blocked too.
 */
export default function ForbiddenPage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const role = useRole();

    return (
        <PreviewSection>
            <AppSection>
                <div className="w-full">
                    <div className="relative flex flex-col items-center text-center">
                        <span className="flex items-center gap-2 rounded-full border border-section-border bg-section-bg px-3 py-1 text-xs font-medium tracking-[0.08em] text-primary uppercase">
                            <ShieldX aria-hidden className="size-3.5" />
                            Error 403
                        </span>

                        <p aria-hidden className="mt-4 text-[84px] leading-none font-semibold text-primary md:text-[120px]">
                            4<span className="text-primary/35">0</span>3
                        </p>

                        <Heading as="h1" size="xlg" className="mt-2">
                            This page isn’t part of your role
                        </Heading>

                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            Your account has no access to{" "}
                            <code className="rounded-md border border-border-subtle bg-light px-1.5 py-0.5 break-all text-foreground">
                                {pathname}
                            </code>
                            . Ask an admin if you believe that’s wrong.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Button className="gap-2" onClick={() => navigate(getHomeRoute(role))}>
                                <Home aria-hidden className="size-4" />
                                Back to home
                            </Button>
                            <Button className="gap-2" variant="secondary" onClick={() => navigate(-1)}>
                                <ArrowLeft aria-hidden className="size-4" />
                                Go back
                            </Button>
                        </div>
                    </div>
                </div>
            </AppSection>
        </PreviewSection>
    );
}
