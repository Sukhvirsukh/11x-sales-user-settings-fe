import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router";
import Sidebar from "./sidebar";
import MobileTopbar from "./MobileTopbar";
import { getAuthToken } from "@/features/auth/authStorage";
import { isSidebarHidden } from "./sidebar/isSidebarHidden";

function AppLayout() {
    const isAuthenticated = Boolean(getAuthToken());
    const location = useLocation();
    const hasSidebar = isSidebarHidden(location.pathname);

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location }}
            />
        );
    }

    if (hasSidebar) {
        return (
            <div className="flex h-screen gap-0 overflow-hidden bg-background p-5">
                <main className="-m-5 flex min-w-0 flex-1 flex-col overflow-y-auto p-5">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen gap-0 overflow-hidden bg-background p-5 md:pr-0">
            <Sidebar />
            <main className="-mx-5 -my-5 flex min-w-0 flex-1 flex-col overflow-y-auto px-5 py-5 md:mx-0">
                <MobileTopbar />
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
