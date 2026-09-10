import { useState, type ReactNode } from "react"
import { Inbox } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Heading from "@/components/design/Heading"
import AppSection from "./AppSectoin"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export interface Column {
    key: string
    header: string
    width?: string
    align?: "left" | "right" | "center"
    render?: (value: unknown, row: Record<string, unknown>) => ReactNode
}

type CustomTableProps = {
    title?: string
    columns: Column[]
    data: Record<string, unknown>[]
    headerActions?: ReactNode
    /** Actions receive selected displayed rows and a callback to deselect processed IDs. */
    bulkActions?: (
        rows: Record<string, unknown>[],
        deselectRows: (ids: (string | number)[]) => void,
    ) => ReactNode
    rowActions?: (row: Record<string, unknown>) => ReactNode
    className?: string
    /** Shown when `data` is empty. Customizes the empty-state message. */
    emptyMessage?: string
    /** Shown when `data` is empty. Customizes the empty-state message. */
    emptyDescription?: string
    /** Shown when `data` is empty. Custom action button/link below the message. */
    emptyStateAction?: ReactNode
    /** Shown when `data` is empty. Replaces the default empty state entirely. */
    emptyState?: ReactNode
} & (
    | { selectable: true; getRowId: (row: Record<string, unknown>) => string | number }
    | { selectable?: false; getRowId?: (row: Record<string, unknown>) => string | number }
)

export default function CustomTable({
    title,
    columns,
    data,
    headerActions,
    bulkActions,
    rowActions,
    className,
    emptyMessage = "No data available",
    emptyDescription = "New entries will appear here once added.",
    emptyStateAction,
    emptyState,
    selectable = false,
    getRowId,
}: CustomTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(() => new Set())
    const rowIds = data.map((row, index) => getRowId ? getRowId(row) : index)
    const selectedRows = data.filter((_, index) => selectedIds.has(rowIds[index]))
    const selectedCount = selectedRows.length
    const allSelected = data.length > 0 && selectedCount === data.length
    const partiallySelected = selectedCount > 0 && !allSelected

    // Only change the displayed rows, preserving selection across filtering.
    function selectRows(ids: (string | number)[], checked: boolean) {
        setSelectedIds((previous) => {
            const next = new Set(previous)
            for (const id of ids) {
                if (checked) next.add(id)
                else next.delete(id)
            }
            return next
        })
    }

    const selectAllCheckbox = (
        <Checkbox
            aria-label="Select all rows"
            checked={allSelected}
            indeterminate={partiallySelected}
            disabled={data.length === 0}
            onCheckedChange={(checked) => selectRows(rowIds, checked)}
            className="data-indeterminate:border-primary data-indeterminate:bg-primary"
        />
    )
    const mobileColumns = columns.filter((col) => col.key !== "select")
    const mobileCellCount = mobileColumns.length + (rowActions ? 1 : 0)
    const lastMobileRowStart = Math.floor((mobileCellCount - 1) / 2) * 2

    return (
        <AppSection className={className}>
            {/* Header bar */}
            {(title || headerActions) && (
                <div className="flex flex-wrap justify-between items-center gap-2 w-full">
                    {title && (
                        <Heading size="md" className="text-[14px] md:text-base leading-none">
                            {title}
                        </Heading>
                    )}
                    {headerActions && <div className="min-w-0 max-w-full">{headerActions}</div>}
                </div>
            )}

            {selectable && bulkActions && selectedCount > 0 && (
                <div aria-label="Bulk actions" role="group" className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-section-border bg-table-header px-4 py-2">
                    <span className="text-sm font-medium" aria-live="polite">
                        {selectedCount} selected
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                            Clear selection
                        </Button>
                        {bulkActions(selectedRows, (ids) => selectRows(ids, false))}
                    </div>
                </div>
            )}

            {/* Table */}
            {selectable && (
                <label className="flex items-center gap-2 text-sm md:hidden">
                    {selectAllCheckbox}
                    Select all rows
                </label>
            )}
            <div className="flex flex-col items-start md:rounded-lg md:border md:border-section-border md:bg-background w-full overflow-hidden">
                <Table className="block md:table">
                    <TableHeader className="hidden md:table-header-group [&_tr]:border-b-0">
                        <TableRow className="bg-table-header hover:bg-section-bg border-0 rounded-[10px]">
                            {selectable && (
                                <TableHead className="w-14 px-5 py-2.5">
                                    {selectAllCheckbox}
                                </TableHead>
                            )}
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`text-[12px] font-normal px-5 py-2.5 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                            {rowActions && (
                                <TableHead className="text-[12px] font-normal px-5 py-2.5 text-right w-28.25">
                                    Action
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="grid gap-3 md:table-row-group">
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIds[rowIndex]}
                                className="grid grid-cols-2 overflow-hidden rounded-lg border! border-section-border bg-white px-2 py-0 md:table-row md:rounded-none md:border-0! md:bg-transparent md:p-0 hover:bg-white md:hover:bg-transparent"
                            >
                                {selectable && (
                                    <TableCell className="col-span-2 border-b border-section-border px-1 py-2 md:border-0 md:px-5">
                                        <Checkbox
                                            aria-label={`Select ${row.name ?? rowIds[rowIndex]}`}
                                            checked={selectedIds.has(rowIds[rowIndex])}
                                            onCheckedChange={(checked) => selectRows([rowIds[rowIndex]], checked)}
                                        />
                                    </TableCell>
                                )}
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className={`${col.key === "select" ? "hidden" : "block"} min-w-0 whitespace-normal break-words ${mobileColumns.indexOf(col) < lastMobileRowStart ? "border-b" : "border-b-0"} border-section-border px-1 py-2 text-left text-[14px] font-normal text-black md:table-cell md:border-0 md:whitespace-nowrap md:px-5 ${col.align === "right" ? "md:text-right" : col.align === "center" ? "md:text-center" : "md:text-left"}`}
                                    >
                                        {col.header && (
                                            <span className="mb-1 block font-semibold md:hidden">
                                                {col.header}
                                            </span>
                                        )}
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key] ?? "")}
                                    </TableCell>
                                ))}
                                {rowActions && (
                                    <TableCell className="block min-w-0 px-1 py-2 text-left text-[14px] font-normal text-black md:table-cell md:px-5 md:text-right">
                                        <span className="mb-1 block font-semibold md:hidden">Action</span>
                                        <div className="flex items-center md:justify-end">
                                            {rowActions(row)}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Empty state */}
                {data.length === 0 && (
                    emptyState ?? (
                        <div className="flex flex-col w-full items-center justify-center gap-2 rounded-lg border border-section-border bg-white px-4 py-10 text-center md:rounded-none md:border-0 md:py-16">
                            <span className="flex size-10 items-center justify-center rounded-full bg-section-bg text-primary">
                                <Inbox aria-hidden="true" className="size-5" />
                            </span>
                            <p className="text-sm font-medium text-black">{emptyMessage}</p>
                            <p className="text-sm text-ghost">{emptyDescription}</p>
                            {emptyStateAction && <div className="mt-2">{emptyStateAction}</div>}
                        </div>
                    )
                )}
            </div>
        </AppSection>
    )
}
