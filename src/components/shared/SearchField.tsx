import { ListFilter, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { InputField } from "../design/InputField";
import FilterPopover, { type FilterPopoverProps } from "./FilterPopover";
import { useRef, useState, type ReactNode, type MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

export type SearchFieldViewport = "xs" | "sm" | "md" | "lg";
type FilterPopoverOptions = Omit<FilterPopoverProps, "trigger" | "children" | "open">;

export interface SearchFieldProps {
    onSearchChange: (value: string) => void
    onFilterClick?: MouseEventHandler<HTMLButtonElement>
    filterCount?: number
    showMobilePanel?: boolean
    /** Breakpoint at which the mobile button is replaced by the inline search field. */
    viewport?: SearchFieldViewport
    /** Removes the inline field's default maximum width. */
    fullWidth?: boolean
    /** Accessible label for the search control. */
    label?: string
    /** Table-specific controls shown inside the filter popover. */
    filterContent?: ReactNode
    /** Count, Clear all, Submit, and open/close callbacks for the filter popover. */
    filterPopoverProps?: FilterPopoverOptions
    /** Disable this control when filters are handled elsewhere. */
    showFilter?: boolean
}

function FilterTrigger({
    children,
    popoverProps,
}: {
    children?: ReactNode;
    popoverProps?: FilterPopoverOptions;
}) {
    return (
        <FilterPopover
            {...popoverProps}
            trigger={
                <button
                    type="button"
                    aria-label="Open filters"
                    className="flex cursor-pointer size-5 shrink-0 items-center justify-center rounded-sm text-content-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <ListFilter className="size-4" aria-hidden="true" />
                </button>
            }
        >
            {children}
        </FilterPopover>
    );
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
    filterContent,
    filterPopoverProps,
    showFilter = true,
    onFilterClick,
    filterCount = 0,
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


    const filterControl = onFilterClick ? (
        <button
            type="button"
            onClick={onFilterClick}
            aria-label={`Open filters (${filterCount} applied)`}
            aria-haspopup="dialog"
            className="flex min-h-6 min-w-6 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-sm text-content-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
            <ListFilter className="size-4" aria-hidden="true" />
            {filterCount > 0 && <span className="text-xs font-medium text-primary" aria-hidden="true">{filterCount}</span>}
        </button>
    ) : showFilter ? (
        <FilterTrigger popoverProps={filterPopoverProps}>{filterContent}</FilterTrigger>
    ) : <ListFilter className="size-4" aria-hidden="true" />;

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
                                        {filterControl}
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
                    : "block w-full max-w-none md:max-w-57.75 ",
                !fullWidth && "md:max-[810px]:max-w-[180px]",
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
                        filterControl
                    }
                    variant="default"
                />
            </div>
        </>
    )
}
