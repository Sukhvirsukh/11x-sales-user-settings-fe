import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";

type SavedPaymentDetailsProps = {
    data: any;
    isLoading: boolean;
};


function CardDetails({ number, cardNumber, cardName, cardType, expiryMonth, expiryYear, cvv }: any) {
    return (
        <AppCard
            header={`${cardType} ${number}`}
            actions={
                <>
                    <Button variant="bare" size="sm">
                        <SquarePen className="size-4 text-content-muted" />
                    </Button>
                    <Button variant="bare" size="sm">
                        <Trash className="size-4 text-content-muted" />
                    </Button>
                </>
            }
        >
            <DetailContainer fullWidth={true} equalWidth={true}>
                <DetailGroup>
                    <DetailItem label="Card number" value={cardNumber} />
                </DetailGroup>
                <DetailGroup>
                    <DetailItem label="Card name" value={cardName} />
                </DetailGroup>
                <DetailGroup>
                    <DetailItem label="Card type" value={cardType} />
                </DetailGroup>
                <DetailGroup>
                    <DetailItem label="Cvv" value="***" />
                </DetailGroup>
                <DetailGroup>
                    <DetailItem label="Expiry" value="**/**" />
                </DetailGroup>
            </DetailContainer>
        </AppCard>
    )
}


function AccountDetails({ number, accountNumber, accountName }: any) {
    return (
        <AppCard
            header={`Account details ${number}`}
            actions={
                <>
                    <Button variant="bare" size="sm">
                        <SquarePen className="size-4 text-content-muted" />
                    </Button>
                    <Button variant="bare" size="sm">
                        <Trash className="size-4 text-content-muted" />
                    </Button>
                </>
            }
        >
            <DetailContainer fullWidth={true} equalWidth={true}>
                <DetailGroup>
                    <DetailItem label="Account number" value={accountNumber} />
                </DetailGroup>
                <DetailGroup>
                    <DetailItem label="Account name" value={accountName} />
                </DetailGroup>
            </DetailContainer>
        </AppCard>
    )
}



export default function SavedPaymentDetails({ data, isLoading }: SavedPaymentDetailsProps) {

    console.log(data)

    return (
        <AppSection>
            <Heading size="lg" className="font-medium">
                Saved payment details
            </Heading>
            {data.map((item: any, index: number) => (
                item.type === "CARD" ? <CardDetails key={index} {...item} /> : <AccountDetails key={index} {...item} />
            ))}
        </AppSection>
    )
}
