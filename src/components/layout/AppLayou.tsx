import {
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";
import { useEffect } from "react";
import Sidebar from "./sidebar";
import MobileTopbar from "./MobileTopbar";
import MobileTopbarWrapper from "./MobileTopbarWrapper";
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
    const shouldHideSidebar = isSidebarHidden(location.pathname);
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
                <Spinner className="size-6 text-brand" />
            </div>
        );
    }

    if (shouldHideSidebar) {
        return (
            <div className="flex h-screen overflow-hidden bg-background">
                <main className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-18 md:px-8 md:pt-7">
                    <div className="md:hidden">
                        <MobileTopbarWrapper />
                    </div>
                    <div className="mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col">
                        <Outlet />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <MobileTopbar />
            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 pt-18 md:px-8 md:pt-7">
                <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AppLayout;
