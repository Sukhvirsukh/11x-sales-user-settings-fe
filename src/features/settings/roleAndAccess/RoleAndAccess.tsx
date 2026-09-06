import { BasicDetails } from "./BasicDetails";
import Permissions from "./Permissions";
import RoleHistory from "./RoleHistory";


export function RoleAndAccess() {
    return (
        <div className="flex flex-col items-start gap-3.5 top-[41px]">
            <div className="flex p-4 flex-col items-start gap-3.5 rounded-[10px] border border-[rgba(53,118,243,0.20)] bg-[#FFF] shadow-[0010px4pxrgba(70,132,250,0.06),0011px8pxrgba(70,132,250,0.05)] w-full overflow-hidden">
                {/* Basic details */}
                <BasicDetails />

                <Permissions />

                <RoleHistory />
            </div>
        </div>
    )
}
