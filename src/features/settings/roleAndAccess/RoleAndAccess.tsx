import { useAuthStore } from "@/features/auth";
import { BasicDetails } from "./basicDetails";
import Permissions from "./permissions";
import RoleHistory from "./roleHistory";


export function RoleAndAccess() {

    const user = useAuthStore(data => data.user);

    return (
        <div className="flex flex-col items-start gap-3.5 pb-5 pt-2">
            <div className="flex p-4 flex-col items-start gap-3.5 rounded-[10px] border border-blue-100/70 bg-white shadow-blue w-full overflow-hidden">
                {/* Basic details */}
                <BasicDetails />

                {user?.role === 'ADMIN' &&
                    <>
                        <Permissions />

                        <RoleHistory />
                    </>
                }
            </div>
        </div>
    )
}
