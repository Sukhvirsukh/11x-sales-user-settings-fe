import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { ToggleField } from "@/components/design/ToggleField";
import { useState } from "react";
import { DetailGroup, DetailItem } from "./BasicDetails";

interface PermissionProps {
    name: string
    isChecked: boolean
    onToggle: () => void
}

const allPermissions = [
    { name: "View Conversations", key: "view-conversations" },
    { name: "Reply to customers", key: "reply-to-customers" },
    { name: "View payments", key: "view-payments" },
    { name: "Change billing", key: "change-billing" },
    { name: "Manage team permissions", key: "manage-team-permissions" },
    { name: "Delete workspace", key: "delete-workspace" },
]

export function Permission({ name, isChecked, onToggle }: PermissionProps) {
    return (
        <div className="flex justify-between items-center w-full">
            <p className="text-[#000] font-inter text-sm leading-none w-fit">
                {name}
            </p>
            <ToggleField
                pressed={isChecked}
                onPressedChange={onToggle}
            />
        </div>
    )
}

export default function Permissions() {

    const [permissions, setPermissions] = useState<Record<string, boolean>>({
        "view-conversations": true,
        "reply-to-customers": true,
        "view-payments": false,
        "change-billing": false,
        "manage-team-permissions": false,
        "delete-workspace": false
    });


    const toggleHandler = (permissionName: string) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionName]: !prevPermissions[permissionName],
        }));
    };

    return (
        <div className="flex items-stretch gap-3.5 w-full">
            <AppSection className="flex-[4_1_0%] min-w-0 h-auto! self-stretch">
                <Heading size="lg" className="font-medium">
                    Permissions
                </Heading>
                <div className="flex flex-col items-start w-full">
                    {
                        allPermissions.map((permission) => (
                            <Permission
                                key={permission.key}
                                name={permission.name}
                                isChecked={permissions[permission.name]}
                                onToggle={() => toggleHandler(permission.name)}
                            />
                        ))
                    }
                </div>
            </AppSection>
            <AppSection className="flex-[1_1_0%] min-w-[250px] !h-auto self-stretch">
                <Heading size="lg" className="font-medium">
                    Other Infomation
                </Heading>
                <div className="flex items-start gap-2.5 w-full">
                    <DetailGroup className="pl-0">
                        <DetailItem
                            label="Mode"
                            value={
                                <div className="flex items-center gap-2">
                                    <Heading size="md">Light Mode</Heading>
                                    <ToggleField
                                        pressed={false}
                                        onPressedChange={() => { }}
                                    />
                                </div>
                            }
                        />

                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem
                            label="Version"
                            value="V12.1"
                        />
                    </DetailGroup>
                </div>
            </AppSection>
        </div>
    )
}
