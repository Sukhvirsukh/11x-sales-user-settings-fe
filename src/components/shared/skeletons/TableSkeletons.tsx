
import { Skeleton } from "@/components/ui/skeleton"

type TableSkeletonProps = {
    columns?: number
    rows?: number
    showHeader?: boolean
}

export default function TableSkeleton({ columns = 5, rows = 5, showHeader = true }: TableSkeletonProps) {
    return (
        <div className={showHeader ? "w-full overflow-hidden rounded-lg border border-section-border bg-white" : "w-full bg-white"}>
            {showHeader && (
                <div className="flex h-10 items-center gap-5 bg-table-header px-5">
                    {Array.from({ length: columns }, (_, index) => (
                        <Skeleton key={index} className="h-3 flex-1" />
                    ))}
                </div>
            )}
            <div className="divide-y divide-section-border">
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-5 px-5 py-4">
                        {Array.from({ length: columns }, (_, columnIndex) => (
                            <Skeleton key={columnIndex} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
