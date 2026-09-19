import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { InputField } from "@/components/design/InputField";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
    value: string;
    className?: string;
    containerClassName?: string;
    variant?: "default" | "light";
}

export default function CopyField({
    value,
    className,
    containerClassName,
    variant
}: CopyFieldProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard access can fail in some environments; fail silently
        }
    };

    return (
        <InputField
            value={value}
            readOnly
            className={cn("truncate text-muted-foreground", className)}
            containerClassName={containerClassName}
            variant={variant}
            endIcon={
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center justify-center text-content-muted hover:text-foreground transition-colors"
                    aria-label={copied ? "Copied" : "Copy to clipboard"}
                >
                    {copied ? (
                        <Check className="size-4 text-status-online-accent" />
                    ) : (
                        <Copy className="size-4" />
                    )}
                </button>
            }
        />
    );
}
