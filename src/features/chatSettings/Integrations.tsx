import { memo, useCallback, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import ActionCard from "@/components/shared/ActionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import shopifyIcon from "@/assets/integrations/shopify.svg";
import backendIcon from "@/assets/integrations/backend.svg";

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
}: {
    active: boolean;
    onToggle: () => void;
}) {
    const Icon = active ? ToggleRight : ToggleLeft;

    return (
        <Button
            variant={active ? "secondary" : "primary"}
            className="gap-2.5 px-4 py-2 md:py-2.5"
            onClick={onToggle}
        >
            {active ? "Active" : "Activate"}
            <Icon className="size-4" />
        </Button>
    );
});

export default function Integrations() {
    const [shopifyActive, setShopifyActive] = useState(true);
    const [backendActive, setBackendActive] = useState(false);

    const toggleShopify = useCallback(() => {
        setShopifyActive((prev) => !prev);
    }, []);

    const toggleBackend = useCallback(() => {
        setBackendActive((prev) => !prev);
    }, []);

    return (
        <div className="flex min-w-0 flex-col gap-2.5 md:gap-4">
            <ActionCard
                icon={<ShopifyIcon />}
                title="Shopify app"
                subtitle="Enables advances shopify features"
                badge={<StatusBadge active={shopifyActive} />}
                actions={
                    <ToggleAction
                        active={shopifyActive}
                        onToggle={toggleShopify}
                    />
                }
            />
            <ActionCard
                icon={<BackendIcon />}
                title="Backend API"
                subtitle="Pull chatbot data from back end via API"
                badge={<StatusBadge active={backendActive} />}
                actions={
                    <ToggleAction
                        active={backendActive}
                        onToggle={toggleBackend}
                    />
                }
            />
        </div>
    );
}
