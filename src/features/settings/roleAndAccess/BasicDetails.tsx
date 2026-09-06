import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { getInitials } from "@/lib/utils";
import { type ReactNode } from "react";
import BasicDetailsForm from "./BasicDetailsForm";

interface DetailItemProps {
    label: string;
    value: ReactNode;
    labelWidth?: string;
}

export function DetailItem({ label, value, labelWidth = "" }: DetailItemProps) {
    return (
        <div className="display-block w-full min-w-0">
            <p className={`text-gray mb-2.5 text-sm ${labelWidth}`}>
                {label}
            </p>
            <p className="text-base break-words">
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
    /* Mobile: display:contents drops the group box so each DetailItem becomes a
       direct cell of the parent 2-col grid (label/value pairs side by side).
       Desktop: original grouped column layout with vertical dividers. */
    return (
        <div className={`contents sm:flex flex-col justify-center py-0 px-5  items-center not-last:border-r not-last:border-r-section-border gap-2 w-fit ${className ?? ""}`}>
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

                <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2.5 sm:gap-5 w-full">
                    {/* profile image section */}
                    <div className="order-1 sm:order-none flex items-center gap-[21px] w-fit">
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

                    {/* Mobile: contents — edit button joins the avatar header row,
                       details drop to a full-width section below it.
                       Desktop: original right-side row with edit on the far right. */}
                    <div className="contents sm:flex justify-between items-center w-full">
                        <div className="order-3 w-full basis-full min-w-0 border-t border-tab pt-2.5 sm:border-t-0 sm:pt-0 sm:order-none sm:basis-auto sm:w-fit">
                            {/* details — mobile: 2-col label/value grid, desktop: grouped row */}
                            <div className="grid grid-cols-2 gap-x-2.5 gap-y-2.5 items-start w-full sm:flex sm:items-start sm:w-fit sm:gap-0">
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
                        </div>
                        <div className="order-2 sm:order-none">
                            <BasicDetailsForm />
                        </div>
                    </div>
                </div>
            </AppCard>
        </AppSection>
    )
}
