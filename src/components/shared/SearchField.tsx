import { ListFilter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InputField } from "../design/InputField";
import { useState } from "react";

interface SearchFieldProps {
    onSearchChange: (value: string) => void
    showMobilePanel?: boolean
}

export default function SearchField({ onSearchChange, showMobilePanel = true }: SearchFieldProps) {

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
                            <Button variant="ghost" size="sm" className="size-[35px] md:hidden" aria-label="Search knowledge base">
                                <Search className="size-4" />
                            </Button>
                        }
                    />
                    <PopoverContent side="top" align="end" sideOffset={8} className="w-[255px] max-w-[calc(100vw-2rem)] rounded-[10px] border border-panel-accent-border bg-popover! p-3 shadow-blue ring-0! md:hidden">
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
                ? "hidden w-full max-w-[231px] md:block"
                : "block w-full max-w-none md:max-w-[231px]"
            }>
                <InputField
                    aria-label="Search knowledge base"
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Search"
                    startIcon={<Search className="size-4" />}
                    endIcon={
                        <ListFilter className="size-4" />
                    }
                    variant="default"
                />
            </div>
        </>
    )
}
