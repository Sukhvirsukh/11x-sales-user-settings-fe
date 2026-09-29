import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import Heading from "@/components/design/Heading";
import { dateFormater } from "@/lib/utils";
import { usePlanQuery } from "./planQuery";

export default function PlanCycleDetails() {
    const { data } = usePlanQuery();
    const currentSubscription = data?.currentSubscription;

    if (!currentSubscription) return null;

    const calculateEndDate = currentSubscription.currentPeriodEnd
        ? new Date(currentSubscription.currentPeriodEnd)
        : new Date(currentSubscription.currentPeriodStart);
    if (!currentSubscription.currentPeriodEnd) {
        calculateEndDate.setMonth(calculateEndDate.getMonth() + 1);
    }

    return (
        <AppSection
            className="w-full"
        >
            <Heading size="lg" responsive>Other details</Heading>
            <AppCard>
                <DetailContainer fullWidth={true} equalWidth={true}>
                    <DetailGroup>
                        <DetailItem label="Start date" value={dateFormater(currentSubscription?.currentPeriodStart, 'long')} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="End date" value={dateFormater(calculateEndDate, 'long')} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Plan" value={currentSubscription?.plan?.name || 'Basic'} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Point used" value="127/990" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Next cycle" value={dateFormater(calculateEndDate, 'long')} />
                    </DetailGroup>
                </DetailContainer>
            </AppCard>
        </AppSection>
    )
}
