import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router";
import Sidebar from "./sidebar";
import MobileTopbar from "./MobileTopbar";
import { getAuthToken } from "@/features/auth/authRequest";

function AppLayout() {
    const isAuthenticated = Boolean(getAuthToken());
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location }}
            />
        );
    }
    return (
        <div className="flex h-screen gap-0 overflow-hidden bg-background p-5 md:gap-5">
            <Sidebar />
            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <MobileTopbar />
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
