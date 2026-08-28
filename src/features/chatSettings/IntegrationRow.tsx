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
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
                >
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isConnected
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                </div>
            </div>

            {isConnected ? (
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    {action}
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            ) : (
                <button className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors">
                    {action}
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}