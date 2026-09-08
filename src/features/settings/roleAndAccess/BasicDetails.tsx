import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { getInitials } from "@/lib/utils";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import BasicDetailsForm from "./BasicDetailsForm";

export function BasicDetails() {
    const name = "Racheal Karl";
    const avatarUrl: string | undefined = undefined;

    return (
        <AppSection>
            <Heading size="lg" className="font-medium">
                Basic details
            </Heading>
            <AppCard>

                <DetailContainer
                    leading={
                        <div className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-section-bg font-medium text-primary">
                            {avatarUrl ? (
                                <img src={avatarUrl} className="size-full object-cover" alt="Profile" />
                            ) : (
                                <span>{getInitials(name)}</span>
                            )}
                        </div>
                    }
                    actions={<BasicDetailsForm />}
                >
                    <DetailGroup>
                        <DetailItem label="Name" value={name} />
                        <DetailItem label="Mail id" value="Alex@co.com" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Phone" value="+91 | 86556788" />
                        <DetailItem label="Role" value="Admin" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Plan name" value="Basic" />
                        <DetailItem label="Points used" value="127/ 990" />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Version" value="V12" />
                    </DetailGroup>
                </DetailContainer>
            </AppCard>
        </AppSection>
    )
}
