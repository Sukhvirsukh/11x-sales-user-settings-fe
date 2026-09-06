import { type ReactNode } from "react";
//components
import BasicDetailsForm from "./BasicDetailsForm";
//common components
import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
//utils
import { getInitials } from "@/lib/utils";

interface DetailItemProps {
    label: string;
    value: ReactNode;
    labelWidth?: string;
}

export function DetailItem({ label, value, labelWidth = "" }: DetailItemProps) {
    return (
        <div className="display-block w-full">
            <p className={`text-gray mb-2.5 text-sm ${labelWidth}`}>
                {label}
            </p>
            <p className="text-base">
                {value}
            </p>
        </div>
    );
}

interface DetailGroupProps {
    children: ReactNode;
    className?: string;
}

export function DetailGroup({ children, className }: DetailGroupProps) {
    return (
        <div className={`flex flex-col justify-center py-0 px-5  items-center not-last:border-r not-last:border-r-section-border gap-2 w-fit ${className ?? ""}`}>
            {children}
        </div>
    );
}

export function BasicDetails() {
    const name = "Racheal Karl";
    const avatarUrl: string | undefined = undefined;

    return (
        <AppSection>
            <Heading size="lg" className="font-medium">
                Basic details
            </Heading>
            <AppCard className="border border-section-border w-full p-2.5">

                <div className="flex items-start gap-5 w-full">
                    {/* profile image section */}
                    <div className="flex items-center gap-[21px] w-fit">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center bg-section-bg text-primary font-medium text-lg shrink-0">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    className="w-[60px] h-[60px] rounded-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                <span>{getInitials(name)}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-start w-fit">
                            {/* details */}
                            <DetailGroup className="pl-0">
                                <DetailItem label="Name" value="Racheal Karl" />
                                <DetailItem label="Mail id" value="Alex@co.com" />
                            </DetailGroup>
                            <DetailGroup className="">
                                <DetailItem
                                    label="Phone"
                                    value="+91 | 86556788"
                                />
                                <DetailItem label="Role" value="Admin" />
                            </DetailGroup>
                            <DetailGroup className="">
                                <DetailItem label="Plan name" value="Basic" />
                                <DetailItem label="Points used" value="127/ 990" />
                            </DetailGroup>
                            <DetailGroup className="">
                                <DetailItem label="Version" value="V12" />
                            </DetailGroup>
                        </div>
                        <BasicDetailsForm />
                    </div>
                </div>
            </AppCard>
        </AppSection>
    )
}
