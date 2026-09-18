import { useCan } from "@/features/auth";
import { BasicDetails } from "./basicDetails";
import RoleHistory from "./roleHistory";


export function RoleAndAccess() {
    const canViewRoles = useCan("settings.roles.view");

    return (
        <>
            {/* Basic details */}
            <BasicDetails />

            {canViewRoles && <RoleHistory />}
        </>
    )
}
