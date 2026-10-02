import {
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";
import { lazy, useEffect } from "react";
import LoadingScreen from "@/components/design/LoadingScreen";
import { authRefreshRequest } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { clearAuthToken, getAuthToken } from "@/features/auth/authStorage";
import { isSidebarHidden } from "./sidebar/isSidebarHidden";

const loadSidebar = () => import("./sidebar");
const loadMobileTopbar = () => import("./MobileTopbar");
const Sidebar = lazy(loadSidebar);
const MobileTopbar = lazy(loadMobileTopbar);
const MobileTopbarWrapper = lazy(() => import("./MobileTopbarWrapper"));

function AppLayout() {
    const authToken = getAuthToken();
    const user = useAuthStore((state) => state.user);
    const isOnBoarding = useAuthStore((state) => state.isOnBoarding);
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const location = useLocation();
    const shouldHideSidebar = isSidebarHidden(location.pathname);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken || user) return;

        let isActive = true;

        if (location.pathname !== "/onboarding" && !shouldHideSidebar) {
            void Promise.allSettled([loadSidebar(), loadMobileTopbar()]);
        }

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
    }, [authToken, clearUser, location.pathname, navigate, setUser, shouldHideSidebar, user]);

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
                <LoadingScreen />
            </div>
        );
    }

    if (isOnBoarding) {
        return location.pathname === "/onboarding"
            ? <Outlet />
            : <Navigate to="/onboarding" replace />;
    }

    if (location.pathname === "/onboarding") return <Navigate to="/" replace />;

    if (shouldHideSidebar) {
        return (
            <div className="flex min-h-dvh gap-0 bg-background p-5 md:h-screen md:overflow-hidden">
                <main className="-m-5 flex min-w-0 flex-1 flex-col md:overflow-y-auto">
                    <div className="p-5 pb-0 md:hidden">
                        <MobileTopbarWrapper />
                    </div>
                    <div className="mt-5 flex min-h-0 flex-1 flex-col md:mt-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh gap-0 bg-background p-5 md:h-screen md:overflow-hidden md:pr-0">
            <Sidebar />
            <MobileTopbar />
            <main className="-m-5 mt-5 flex min-w-0 flex-1 flex-col p-5 md:-mt-5 md:mx-0 md:overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
