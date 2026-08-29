import { Copy } from "lucide-react";
import { useState } from "react";

interface CopyFieldProps {
    value: string;
}

export default function CopyField({ value }: CopyFieldProps) {
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
        <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-muted px-3 py-2">
            <span className="min-w-0 truncate text-sm text-muted-foreground">{value}</span>
            <button
                onClick={handleCopy}
                className="shrink-0 rounded-md p-1 text-placeholder hover:bg-border hover:text-muted-foreground transition-colors"
                aria-label="Copy to clipboard"
            >
                <Copy className="h-4 w-4" />
            </button>
            {copied && (
                <span className="absolute -mt-8 text-xs text-muted-foreground">Copied</span>
            )}
        </div>
    );
}