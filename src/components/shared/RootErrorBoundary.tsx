import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorPage from "@/pages/ErrorPage";

export default class RootErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Unhandled application error", error, info.componentStack);
    }

    render() {
        return this.state.hasError ? <ErrorPage /> : this.props.children;
    }
}
