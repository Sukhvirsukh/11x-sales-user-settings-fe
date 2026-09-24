import { ListFilter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InputField } from "../design/InputField";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type SearchFieldViewport = "xs" | "sm" | "md";

export interface SearchFieldProps {
    onSearchChange: (value: string) => void
    showMobilePanel?: boolean
    /** Breakpoint at which the popover is replaced by the inline search field. */
    viewport?: SearchFieldViewport
}

const panelVisibilityClasses: Record<SearchFieldViewport, string> = {
    xs: "xs:hidden",
    sm: "sm:hidden",
    md: "md:hidden",
};

const inlineVisibilityClasses: Record<SearchFieldViewport, string> = {
    xs: "hidden w-full max-w-[231px] xs:block",
    sm: "hidden w-full max-w-[231px] sm:block",
    md: "hidden w-full max-w-[231px] md:block",
};

export default function SearchField({
    onSearchChange,
    showMobilePanel = true,
    viewport = "md",
}: SearchFieldProps) {

    const [search, setSearch] = useState("");

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange(value);
    };


    return (
        <>
            {showMobilePanel && (
                <Popover>
                    <PopoverTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("bg-white px-1.5", panelVisibilityClasses[viewport])}
                                aria-label="Search knowledge base"
                            >
                                <Search className="size-4" />
                            </Button>
                        }
                    />
                    <PopoverContent
                        side="top"
                        align="center"
                        sideOffset={8}
                        className={cn(
                            "w-63.75 max-w-[calc(100vw-2rem)] rounded-[10px] border border-panel-accent-border bg-popover! p-3 shadow-blue ring-0!",
                            panelVisibilityClasses[viewport],
                        )}
                    >
                        <InputField
                            aria-label="Search knowledge base"
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search"
                            startIcon={<Search className="size-4" />}
                            endIcon={<ListFilter className="size-4" />}
                            variant="default"
                        />
                    </PopoverContent>
                </Popover>
            )}
            <div className={showMobilePanel
                ? inlineVisibilityClasses[viewport]
                : "block w-full max-w-none md:max-w-[231px]"
            }>
                <InputField
                    aria-label="Search knowledge base"
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
