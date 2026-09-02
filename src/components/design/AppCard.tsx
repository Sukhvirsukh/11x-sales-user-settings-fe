import type { ReactNode } from "react";

export default function AppCard({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-[10px] bg-white p-2.5 md:p-4">
            {children}
        </div>
    );
}
