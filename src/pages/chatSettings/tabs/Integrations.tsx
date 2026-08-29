import IntegrationRow from "@/features/chatSettings/IntegrationRow";
import { ShoppingBag, Wrench } from "lucide-react";

export default function Integrations() {
    return (
        <div className="flex flex-col gap-4">
            <IntegrationRow
                icon={<ShoppingBag className="h-5 w-5 text-primary-foreground" />}
                iconBg="bg-success-strong"
                name="Shopify app"
                status="Connected"
                description="Enables advances shopify features"
                action="Activated"
            />
            <IntegrationRow
                icon={<Wrench className="h-5 w-5 text-foreground/80" />}
                iconBg="bg-destructive-muted"
                name="Backend API"
                status="Inactive"
                description="Pull chatbot data from back end via API"
                action="Activate"
            />
        </div>
    );
}