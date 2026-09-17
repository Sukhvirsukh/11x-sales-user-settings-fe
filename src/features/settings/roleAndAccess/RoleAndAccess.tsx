import { useAuthStore } from "@/features/auth";
import { BasicDetails } from "./basicDetails";
import RoleHistory from "./roleHistory";


export function RoleAndAccess() {

    const user = useAuthStore(data => data.user);

    return (
        <>
            {/* Basic details */}
            <BasicDetails />

            {user?.role === 'ADMIN' &&
                <>
                    {/* <Permissions /> */}

                    <RoleHistory />
                </>
            }
        </>
    )
}
