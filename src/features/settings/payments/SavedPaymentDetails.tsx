import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";

export default function SavedPaymentDetails() {
    return (
        <AppSection>
            <Heading size="lg" className="font-medium">
                Saved payment details
            </Heading>
            <AppCard
                header="Credit card 1"
                actions={
                    <>
                        <Button variant="bare" size="sm">
                            <SquarePen className="size-4 text-gray" />
                        </Button>
                        <Button variant="bare" size="sm">
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </>
                }
            >
                <DetailContainer fullWidth={true} equalWidth={true}>
                    <DetailGroup>
                        <DetailItem label="Card number" value="8888 8888 8888 8888" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Card name" value="Gurwinder Singh" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Card type" value="Credit card" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Cvv" value="***" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Expiry" value="**/**" />
                    </DetailGroup>
                </DetailContainer>
            </AppCard>

            <AppCard
                header="Account details 1"
                actions={
                    <>
                        <Button variant="bare" size="sm">
                            <SquarePen className="size-4 text-gray" />
                        </Button>
                        <Button variant="bare" size="sm">
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </>
                }
            >
                <DetailContainer fullWidth={true} equalWidth={true}>
                    <DetailGroup>
                        <DetailItem label="Account number" value="12097 7654 6777" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Account name" value="Racheal Karl" />
                    </DetailGroup>
                </DetailContainer>
            </AppCard>
        </AppSection>
    )
}
