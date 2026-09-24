import {
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";
import { useEffect } from "react";
import Sidebar from "./sidebar";
import MobileTopbar from "./MobileTopbar";
import { Spinner } from "@/components/ui/spinner";
import { authRefreshRequest } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { clearAuthToken, getAuthToken } from "@/features/auth/authStorage";
import { isSidebarHidden } from "./sidebar/isSidebarHidden";

function AppLayout() {
    const authToken = getAuthToken();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const location = useLocation();
    const hasSidebar = isSidebarHidden(location.pathname);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken || user) return;

        let isActive = true;

        authRefreshRequest()
            .then((refreshedUser) => {
                if (isActive) setUser(refreshedUser);
            }).catch(() => {
                if (!isActive) return;
                clearAuthToken();
                clearUser();
                navigate("/sign-in", { replace: true });
            });

        return () => {
            isActive = false;
        };
    }, [authToken, clearUser, setUser, user]);

    if (!authToken) {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Spinner className="size-6 text-primary" />
            </div>
        );
    }

    if (hasSidebar) {
        return (
            <div className="flex h-screen gap-0 overflow-hidden bg-background p-5">
                <main className="-m-5 flex min-w-0 flex-1 flex-col overflow-y-auto">
                    <div className="p-5 pb-0 md:p-0">
                        <MobileTopbar />
                    </div>
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen gap-0 overflow-hidden bg-background p-5 md:pr-0">
            <Sidebar />
            <MobileTopbar />
            <main className="-m-5 mt-5 md:-mt-5 flex min-w-0 flex-1 flex-col overflow-y-auto p-5 md:mx-0">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
