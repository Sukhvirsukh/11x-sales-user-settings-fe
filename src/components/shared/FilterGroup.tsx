import { useId, type ReactNode } from "react"

interface FilterGroupProps {
    label: string
    selectedCount: number
    children: ReactNode
}

export default function FilterGroup({ label, selectedCount, children }: FilterGroupProps) {
    const labelId = useId()

    return (
        <div className="space-y-2" role="group" aria-labelledby={labelId}>
            <div className="flex items-center justify-between gap-3">
                <p id={labelId} className="text-sm font-medium text-content-strong">{label}</p>
                <span className="text-xs text-content-muted">{selectedCount} selected</span>
            </div>
            {children}
        </div>
    )
}
