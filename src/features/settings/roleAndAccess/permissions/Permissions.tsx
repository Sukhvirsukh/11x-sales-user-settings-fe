import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { ToggleField } from "@/components/design/ToggleField";
import { useEffect, useState } from "react";
import { DetailGroup, DetailItem } from "@/components/design/DetailContainer";

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
        <div className="flex justify-between items-center w-full py-2.5">
            <p className="text-foreground font-inter text-base leading-none w-fit">
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
    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark",
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);


    const toggleHandler = (permissionName: string) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionName]: !prevPermissions[permissionName],
        }));
    };

    return (
        <div className="flex flex-col md:flex-row items-stretch gap-3.5 w-full">
            <AppSection className="w-full md:w-auto md:flex-[4_1_0%] min-w-0 h-auto! self-stretch">
                <Heading size="md" className="font-medium">
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
            <AppSection className="w-full md:w-auto md:flex-[1_1_0%] min-w-0 md:min-w-[250px] !h-auto self-stretch">
                <Heading size="lg" className="font-medium">
                    Other Infomation
                </Heading>
                <div className="flex items-start w-full">
                    <DetailGroup className="pl-0!">
                        <DetailItem
                            label="Mode"
                            value={
                                <div className="flex items-center gap-2">
                                    <p className="text-base">{isDarkMode ? "Dark Mode" : "Light Mode"}</p>
                                    <ToggleField
                                        pressed={isDarkMode}
                                        onPressedChange={setIsDarkMode}
                                        aria-label="Toggle dark mode"
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
