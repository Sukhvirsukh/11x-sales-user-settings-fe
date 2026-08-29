import { RefreshCw } from "lucide-react";

interface IntegrationRowProps {
    icon: React.ReactNode;
    iconBg: string;
    name: string;
    status: string;
    description: string;
    action: string;
}

export default function IntegrationRow({ icon, iconBg, name, status, description, action }: IntegrationRowProps) {
    const isConnected = status === "Connected";

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-body font-medium text-foreground">{name}</span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-micro font-medium ${isConnected
                                ? "bg-success-muted text-success"
                                : "bg-destructive-muted text-destructive"
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                    <p className="mt-0.5 text-caption text-muted-foreground">{description}</p>
                </div>
            </div>

            {isConnected ? (
                <button className="flex min-h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-caption font-medium text-muted-foreground transition-colors hover:bg-muted sm:w-fit">
                    {action}
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            ) : (
                <button className="flex min-h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 text-caption font-medium text-primary-foreground transition-colors hover:bg-foreground/80 sm:w-fit">
                    {action}
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}