import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { getInitials } from "@/lib/utils";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import BasicDetailsForm from "./BasicDetailsForm";
import { useAuthStore, useCan } from "@/features/auth";
import { useAgentStore } from "@/features/agents/agentStore";
import { usePlanQuery } from "@/features/settings/plan/planQuery";
import { capitalize } from "@/lib/utils";

/** Billing belongs to the account owner, so only they load the plan. */
function PlanName() {
    const { data, isLoading } = usePlanQuery();
    if (isLoading) return <>…</>;
    return <>{data?.currentSubscription.plan.name ?? "—"}</>;
}

export function BasicDetails() {
    const avatarUrl: string | undefined = undefined;
    const user = useAuthStore(data => data.user);
    const canEditBasicDetails = useCan("settings.profile.create");
    const name = user?.name || '';
    const canSeePlan = useCan("settings.plan.view");
    const storeName = useAgentStore((state) => state.agents.find((agent) => agent.id === state.currentAgentId)?.name);

    return (
        <AppSection>
            <Heading size="lg">Your profile</Heading>
            <AppCard>

                <DetailContainer
                    leading={
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-display font-semibold text-foreground">
                            {avatarUrl ? (
                                <img src={avatarUrl} className="size-full object-cover" alt="Profile" />
                            ) : (
                                <span className="text-xl">{getInitials(name)}</span>
                            )}
                        </div>
                    }
                    actions={canEditBasicDetails ? <BasicDetailsForm /> : undefined}
                >
                    <DetailGroup>
                        <DetailItem label="Name" value={name} />
                        <DetailItem label="Email" value={user?.email} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Phone" value={user?.phone || '-'} />
                        <DetailItem label="Role" value={user?.role ? capitalize(user.role.toLowerCase()) : "-"} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Store" value={storeName ?? "-"} />
                        {canSeePlan && <DetailItem label="Plan" value={<PlanName />} />}
                    </DetailGroup>
                </DetailContainer>
            </AppCard>
        </AppSection>
    )
}
