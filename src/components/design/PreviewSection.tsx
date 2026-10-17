import type { ReactNode } from "react";

/** Content area under a page's tabs. Panels sit straight on the canvas, so this only spaces them. */
export default function PreviewSection({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full flex-col items-start gap-4 pb-6 pt-1">
            {children}
        </div>
    )
}
