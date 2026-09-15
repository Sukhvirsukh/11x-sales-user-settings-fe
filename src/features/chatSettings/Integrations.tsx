import { memo, useCallback, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import ActionCard from "@/components/shared/ActionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import shopifyIcon from "@/assets/integrations/shopify.svg";
import backendIcon from "@/assets/integrations/backend.svg";
import { useIntegrationsQuery } from "./chatSettingsQuery";

const ShopifyIcon = memo(function ShopifyIcon() {
    return (
        <img
            src={shopifyIcon}
            alt=""
            className="size-10 shrink-0 rounded md:size-[47px]"
        />
    );
});

const BackendIcon = memo(function BackendIcon() {
    return (
        <img
            src={backendIcon}
            alt=""
            className="size-10 shrink-0 rounded md:size-[47px]"
        />
    );
});

const StatusBadge = memo(function StatusBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? "default" : "destructive"}>
            {active ? "Active" : "Inactive"}
        </Badge>
    );
});

const ToggleAction = memo(function ToggleAction({
    active,
    onToggle,
    disabled,
}: {
    active: boolean;
    onToggle: () => void;
    disabled?: boolean;
}) {
    const Icon = active ? ToggleRight : ToggleLeft;

    return (
        <Button
            variant='secondary'
            className={`gap-2 px-2! py-1.5! rounded-[10px] ${active ? 'bg-badge-active-bg' : ''}`}
            onClick={onToggle}
            disabled={disabled}
            aria-disabled={disabled}
            size='sm'
        >
            {active ? "Deactivate" : "Activate"}
            <Icon className="size-4" />
        </Button>
    );
});

export default function Integrations() {
    const { data, isLoading } = useIntegrationsQuery();
    const [backendActive, setBackendActive] = useState(false);

    const shopifyActive = data?.shopify?.connected || false;

    const toggleShopify = useCallback(() => {
        if (!shopifyActive) {
            window.open("https://www.shopify.com/", "_blank");
        }
    }, []);

    const toggleBackend = useCallback(() => {
        setBackendActive((prev) => !prev);
    }, []);

    return (
        <div className="flex min-w-0 flex-col gap-2.5 md:gap-4">
            <ActionCard
                variant="bare"
                icon={<ShopifyIcon />}
                title="Shopify app"
                subtitle="Enables advances shopify features"
                badge={<StatusBadge active={shopifyActive} />}
                actions={
                    <ToggleAction
                        active={shopifyActive}
                        onToggle={toggleShopify}
                        disabled={isLoading}
                    />
                }
            />
            <div className="separator" />
            <ActionCard
                variant="bare"
                icon={<BackendIcon />}
                title="Backend API"
                subtitle="Pull chatbot data from back end via API"
                badge={<StatusBadge active={backendActive} />}
                actions={
                    <ToggleAction
                        active={backendActive}
                        onToggle={toggleBackend}
                        disabled={isLoading}
                    />
                }
            />
        </div>
    );
}
