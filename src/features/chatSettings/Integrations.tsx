import { memo, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ToggleLeft, ToggleRight } from "lucide-react";
import ActionCard from "@/components/shared/ActionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import shopifyIcon from "@/assets/integrations/shopify.svg";
import backendIcon from "@/assets/integrations/backend.svg";
import { chatSettingsIntegrationsQueryKey, useIntegrationsQuery } from "./chatSettingsQuery";
import { connectShopify, disconnectShopify } from "./chatSettingsApi";
import Modal from "@/components/design/Modal";
import { InputField } from "@/components/design/InputField";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/queryClient";
import { useCan } from "@/features/auth";

const ShopifyIcon = memo(function ShopifyIcon() {
    return (
        <img
            src={shopifyIcon}
            alt=""
            className="size-10 shrink-0 rounded md:size-11.75"
        />
    );
});

const BackendIcon = memo(function BackendIcon() {
    return (
        <img
            src={backendIcon}
            alt=""
            className="size-10 shrink-0 rounded md:size-11.75"
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
            className={`gap-2 px-2! py-1.5! rounded-[10px] ${active ? 'bg-badge-active-background' : ''}`}
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
    // Connecting or disconnecting an integration is a change, so it follows the
    // section's `create` grant. Without it the buttons stay visible but inert.
    const canManageIntegrations = useCan("chatSettings.create");
    const [backendActive, setBackendActive] = useState(false);

    const shopifyActive = data?.shopify?.connected || false;
    const [searchParams, setSearchParams] = useSearchParams();
    // Installed from inside Shopify's admin: the backend sends the merchant here to finish connecting.
    const [shopDialogOpen, setShopDialogOpen] = useState(() => Boolean(searchParams.get("connectShopify")));
    const [shop, setShop] = useState(() => searchParams.get("connectShopify") ?? "");

    // Back from Shopify's approval screen: say how it went, then tidy the address bar.
    useEffect(() => {
        const outcome = searchParams.get("shopify");
        if (!outcome) return;
        const messages: Record<string, [ "success" | "error", string ]> = {
            connected: ["success", "Your Shopify store is connected."],
            cancelled: ["error", "Connecting Shopify was cancelled."],
            expired: ["error", "That approval took too long. Please connect again."],
            error: ["error", "Shopify didn't confirm the connection. Please try again."],
        };
        const [type, description] = messages[outcome] ?? messages.error;
        toast.add({ type, title: "Shopify", description });
        const next = new URLSearchParams(searchParams);
        next.delete("shopify");
        next.delete("connectShopify");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    const connectMutation = useMutation({
        mutationFn: connectShopify,
        onSuccess: ({ authorizeUrl }) => window.location.assign(authorizeUrl),
    });

    const disconnectMutation = useMutation({
        mutationFn: disconnectShopify,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: chatSettingsIntegrationsQueryKey });
            toast.add({ type: "success", title: "Shopify", description: "Your Shopify store is disconnected." });
        },
    });

    const toggleShopify = useCallback(() => {
        // Guard the action itself, not only the button, so a stray call can never
        // apply an integration without the grant.
        if (!canManageIntegrations) return;
        if (shopifyActive) disconnectMutation.mutate();
        else setShopDialogOpen(true);
    }, [canManageIntegrations, shopifyActive, disconnectMutation]);

    const toggleBackend = useCallback(() => {
        if (!canManageIntegrations) return;
        setBackendActive((prev) => !prev);
    }, [canManageIntegrations]);

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
                        disabled={isLoading || !canManageIntegrations || connectMutation.isPending || disconnectMutation.isPending}
                    />
                }
                contentClassName="flex-row items-center justify-between"
                actionsClassName="self-end"
            />
            {shopifyActive && data?.shopify?.shopDomain ? (
                <p className="-mt-1 text-sm text-content-muted">Connected to {data.shopify.shopDomain}</p>
            ) : null}
            <Modal
                open={shopDialogOpen}
                onOpenChange={setShopDialogOpen}
                title="Connect your Shopify store"
                primaryAction={{
                    label: "Continue to Shopify",
                    onClick: () => connectMutation.mutate(shop),
                    disabled: !shop.trim() || connectMutation.isPending,
                }}
                closeAction={{ label: "Cancel", disabled: connectMutation.isPending }}
            >
                <form
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (shop.trim()) connectMutation.mutate(shop);
                    }}
                >
                    <InputField
                        label="Shopify store address"
                        placeholder="your-store.myshopify.com"
                        labelClassName="text-sm font-medium"
                        value={shop}
                        onChange={(event) => setShop(event.target.value)}
                        autoFocus
                    />
                    <p className="mt-2 text-sm text-content-muted">
                        You'll approve the 11x Sales app in your Shopify admin, then come back here.
                    </p>
                </form>
            </Modal>
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
                        disabled={isLoading || !canManageIntegrations}
                    />
                }
                contentClassName="flex-row items-center justify-between"
                actionsClassName="self-end"
            />
        </div>
    );
}
