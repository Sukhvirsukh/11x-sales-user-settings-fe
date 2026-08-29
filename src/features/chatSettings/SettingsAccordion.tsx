import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface SettingsAccordionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  showDivider?: boolean;
}

export function SettingsAccordion({
  title,
  open,
  onToggle,
  children,
  showDivider = true,
}: SettingsAccordionProps) {
  return (
    <Collapsible open={open} className={cn("min-w-0", showDivider && "border-b border-border")}>
      <CollapsibleTrigger
        onClick={onToggle}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between py-3 text-left text-body font-medium text-foreground"
      >
        {title}
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-3 min-w-0 rounded-md bg-surface-inset p-2 sm:mb-4 sm:p-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
