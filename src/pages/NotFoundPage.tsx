import { ArrowLeft, Compass, Home } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/components/layout/sidebar/sideNav";
import PreviewSection from "@/components/design/PreviewSection";
import AppSection from "@/components/design/AppSectoin";

export default function NotFoundPage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const destinations = NAV_ITEMS.filter((item) => item.link !== "/");

    return (

        <PreviewSection>
            <AppSection>
                <div className="w-full">
                    <div className="relative flex flex-col items-center text-center">
                        <span className="flex items-center gap-2 rounded-full border border-section-border bg-section-bg px-3 py-1 text-xs font-medium tracking-[0.08em] text-primary uppercase">
                            <Compass aria-hidden className="size-3.5" />
                            Error 404
                        </span>

                        <p aria-hidden className="mt-4 text-[84px] leading-none font-semibold text-primary md:text-[120px]">
                            4<span className="text-primary/35">0</span>4
                        </p>

                        <Heading as="h1" size="xlg" className="mt-2">
                            This page went off the map
                        </Heading>

                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            We couldn’t find{" "}
                            <code className="rounded-md border border-border-subtle bg-light px-1.5 py-0.5 break-all text-foreground">
                                {pathname}
                            </code>
                            . It may have been moved, renamed, or never existed.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Button className="gap-2" onClick={() => navigate("/")}>
                                <Home aria-hidden className="size-4" />
                                Back to dashboard
                            </Button>
                            <Button className="gap-2" variant="secondary" onClick={() => navigate(-1)}>
                                <ArrowLeft aria-hidden className="size-4" />
                                Go back
                            </Button>
                        </div>
                    </div>

                    <div className="relative mt-10 border-t border-section-border pt-6">
                        <p className="mb-3 text-sm font-medium text-foreground">Popular destinations</p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {destinations.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.link}
                                        className="flex items-center gap-2 rounded-lg border border-section-border px-2.5 py-2 text-sm text-foreground transition-all hover:border-active-border hover:bg-active-bg"
                                    >
                                        <Icon className="size-5 shrink-0 text-muted-foreground" />
                                        <span className="truncate">{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </AppSection>
        </PreviewSection>
    );
}
