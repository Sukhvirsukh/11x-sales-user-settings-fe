import { ListFilter } from "lucide-react";
import { useState, type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface FilterPopoverProps {
    /** Optional trigger. Omit it to drive the popover from `open`/`onOpenChange`. */
    trigger?: ReactElement;
    /** Ref to the element the popover is anchored to. Required when there is no `trigger`. */
    anchor?: React.RefObject<HTMLElement | null>;
    /** Element focused when the popover closes (e.g. the button that opened it). */
    finalFocus?: ComponentProps<typeof PopoverContent>["finalFocus"];
    children?: ReactNode;
    selectedCount?: number;
    onClearAll?: () => void;
    onSubmit?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function EmptyFilterState() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-section-border bg-surface-raised px-4 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-section-background text-primary">
                <ListFilter aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-medium text-content-strong">No filters available yet.</p>
            <p className="text-sm text-content-muted">Filters for this table will appear here.</p>
        </div>
    );
}

export default function FilterPopover({
    trigger,
    anchor,
    finalFocus,
    children,
    selectedCount = 0,
    onClearAll,
    onSubmit,
    open,
    onOpenChange,
}: FilterPopoverProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open ?? internalOpen;

    const handleOpenChange = (nextOpen: boolean) => {
        if (open === undefined) setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };

    const handleSubmit = () => {
        onSubmit?.();
        handleOpenChange(false);
    };

    // "Clear all" resets the drafts in the parent and applies them there, so the
    // popover only closes. It must not call `handleSubmit` as well: `onSubmit`
    // reads the parent's draft state from the current render, which is still the
    // pre-clear value, and would write the old filters straight back.
    const clearAll = () => {
        onClearAll?.();
        handleOpenChange(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && <PopoverTrigger render={trigger} />}
            <PopoverContent
                anchor={anchor}
                finalFocus={finalFocus}
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-80 max-h-[80vh] gap-0 overflow-hidden rounded-[10px] border border-control-border-subtle bg-popover p-0 shadow-panel ring-0"
            >
                <div className="flex shrink-0 items-center justify-between gap-2  px-4 pt-4">
                    <p className="font-inter text-lg font-semibold text-foreground">
                        Filters ({selectedCount})
                    </p>
                    <Button
                        type="button"
                        variant="underline-bare"
                        size="sm"
                        disabled={!onClearAll || selectedCount === 0}
                        onClick={clearAll}
                    >
                        Clear all
                    </Button>
                </div>

                <div className="min-h-0 overflow-y-auto px-4 py-3.5">
                    {children ?? <EmptyFilterState />}
                </div>

                <div className="flex w-full shrink-0 items-start gap-2.5 px-4 pb-4">
                    <Button onClick={handleSubmit} disabled={!onSubmit} size='xs'>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => handleOpenChange(false)} size='xs'>
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
