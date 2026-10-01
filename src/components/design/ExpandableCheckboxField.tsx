import type { ReactNode } from "react";
import Label from "@/components/design/Label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExpandableCheckboxFieldProps {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children: ReactNode;
    isOpen?: boolean;
}

export default function ExpandableCheckboxField({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    children,
    isOpen,
}: ExpandableCheckboxFieldProps) {
    return (
        <div>
            <div className="flex items-center gap-3">
                <Checkbox
                    id={id}
                    name={id}
                    checked={checked}
                    onCheckedChange={(value) => onCheckedChange?.(value === true)}
                    aria-describedby={description ? `${id}-description` : undefined}
                    className="shrink-0 rounded-full p-2"
                />
                <div className="flex flex-col gap-1">
                    <Label htmlFor={id}>{label}</Label>
                    {description && isOpen && (
                        <p id={`${id}-description`} className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {isOpen && <div className="ml-7.5 my-2.5">{children}</div>}
        </div>
    );
}
