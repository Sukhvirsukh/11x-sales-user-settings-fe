import { ListFilter, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { InputField } from "../design/InputField";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SearchFieldViewport = "xs" | "sm" | "md" | "lg";

export interface SearchFieldProps {
    onSearchChange: (value: string) => void
    showMobilePanel?: boolean
    /** Breakpoint at which the mobile button is replaced by the inline search field. */
    viewport?: SearchFieldViewport
    /** Removes the inline field's default maximum width. */
    fullWidth?: boolean
    /** Accessible label for the search control. */
    label?: string
}

const mobileVisibilityClasses: Record<SearchFieldViewport, string> = {
    xs: "xs:hidden",
    sm: "sm:hidden",
    md: "md:hidden",
    lg: "lg:hidden",
};

const inlineVisibilityClasses: Record<SearchFieldViewport, string> = {
    xs: "hidden w-full max-w-[231px] xs:block",
    sm: "hidden w-full max-w-[231px] sm:block",
    md: "hidden w-full max-w-[231px] md:block",
    lg: "hidden w-full max-w-[231px] lg:block",
};

export default function SearchField({
    onSearchChange,
    showMobilePanel = true,
    viewport = "md",
    fullWidth = false,
    label = "Search knowledge base",
}: SearchFieldProps) {

    const [search, setSearch] = useState("");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const mobileButtonRef = useRef<HTMLButtonElement>(null);

    const closeMobileSearch = () => {
        setIsMobileOpen(false);
        mobileButtonRef.current?.focus();
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange(value);
    };


    return (
        <>
            {showMobilePanel && (
                <div className={cn("inline-flex shrink-0", mobileVisibilityClasses[viewport])}>
                    <Button
                        ref={mobileButtonRef}
                        variant="ghost"
                        size="sm"
                        className="bg-white px-1.5"
                        aria-label={label}
                        aria-expanded={isMobileOpen}
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Search className="size-4" />
                    </Button>
                    {isMobileOpen && (
                        <div
                            className="absolute inset-x-0 top-1/2 z-30 origin-right -translate-y-1/2 bg-app-section-background motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-75 motion-safe:slide-in-from-right-2 motion-safe:duration-200 motion-reduce:animate-none"
                        >
                            <InputField
                                autoFocus
                                aria-label={label}
                                value={search}
                                onChange={(event) => handleSearchChange(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") {
                                        closeMobileSearch();
                                    }
                                }}
                                placeholder="Search"
                                startIcon={<Search className="size-4" />}
                                endIcon={
                                    <span className="flex items-center gap-2">
                                        <ListFilter className="size-4" aria-hidden="true" />
                                        <button
                                            type="button"
                                            aria-label="Close search"
                                            onClick={closeMobileSearch}
                                            className="flex size-5 items-center justify-center rounded-sm text-content-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                                        >
                                            <X className="size-4" aria-hidden="true" />
                                        </button>
                                    </span>
                                }
                                containerClassName="h-[37px]"
                                variant="default"
                            />
                        </div>
                    )}
                </div>
            )}
            <div className={cn(
                showMobilePanel
                    ? inlineVisibilityClasses[viewport]
                    : "block w-full max-w-none md:max-w-[231px]",
                fullWidth && "max-w-none md:max-w-none",
            )}>
                <InputField
                    aria-label={label}
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Search"
                    startIcon={<Search className="size-4" />}
                    containerClassName="h-[37px] md:w-full"
                    endIcon={
                        <ListFilter className="size-4" />
                    }
                    variant="default"
                />
            </div>
        </>
    )
}
