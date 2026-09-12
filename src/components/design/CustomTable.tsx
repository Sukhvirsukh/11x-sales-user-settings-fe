import { useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"
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

type CustomTableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
    title?: string
    columns: Column[]
    data: T[]
    headerActions?: ReactNode
    /** Actions receive selected displayed rows and a callback to deselect processed IDs. */
    bulkActions?: (
        rows: T[],
        deselectRows: (ids: (string | number)[]) => void,
    ) => ReactNode
    rowActions?: (row: T) => ReactNode
    className?: string
    /** Shown when `data` is empty. Customizes the empty-state message. */
    emptyMessage?: string
    /** Shown when `data` is empty. Customizes the empty-state message. */
    emptyDescription?: string
    /** Shown when `data` is empty. Custom action button/link below the message. */
    emptyStateAction?: ReactNode
    /** Shown when `data` is empty. Replaces the default empty state entirely. */
    emptyState?: ReactNode
    /** Enables pagination. Provide `page`, `total`, and `onPageChange` for server-side pagination. */
    pagination?: {
        pageSize?: number
        page?: number
        total?: number
        onPageChange?: (page: number) => void
    }
} & (
        | { selectable: true; getRowId: (row: T) => string | number }
        | { selectable?: false; getRowId?: (row: T) => string | number }
    )

export default function CustomTable<T extends Record<string, unknown>>({
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
    pagination,
    selectable = false,
    getRowId,
}: CustomTableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(() => new Set())
    const [localPage, setLocalPage] = useState(1)
    const rowIds = data.map((row, index) => getRowId ? getRowId(row) : index)
    const pageSize = Math.max(1, pagination?.pageSize ?? (data.length || 1))
    const isServerPagination = Boolean(pagination?.onPageChange)
    const totalItems = isServerPagination ? (pagination?.total ?? data.length) : data.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const requestedPage = isServerPagination ? (pagination?.page ?? 1) : localPage
    const currentPage = Math.min(requestedPage, totalPages)
    const pageStart = (currentPage - 1) * pageSize
    const displayedData = pagination && !isServerPagination ? data.slice(pageStart, pageStart + pageSize) : data
    const displayedRowIds = displayedData.map((row, index) => {
        const dataIndex = pagination ? pageStart + index : index
        return getRowId ? getRowId(row) : dataIndex
    })
    const selectedRows = data.filter((_, index) => selectedIds.has(rowIds[index]))
    const selectedCount = selectedRows.length
    const selectedDisplayedCount = displayedRowIds.filter((id) => selectedIds.has(id)).length
    const allSelected = displayedRowIds.length > 0 && selectedDisplayedCount === displayedRowIds.length
    const partiallySelected = selectedDisplayedCount > 0 && !allSelected

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

    function changePage(nextPage: number) {
        if (isServerPagination) pagination?.onPageChange?.(nextPage)
        else setLocalPage(nextPage)
    }

    function SelectAllCheckbox() {
        return (
            <Checkbox
                aria-label="Select all rows"
                checked={allSelected}
                indeterminate={partiallySelected}
                disabled={displayedData.length === 0}
                onCheckedChange={(checked) => selectRows(displayedRowIds, checked)}
                className="data-indeterminate:border-primary data-indeterminate:bg-primary"
            />
        )
    }
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

            {/* Table */}
            {selectable && (
                <label className="flex items-center gap-2 text-sm md:hidden">
                    <SelectAllCheckbox />
                    Select all rows
                </label>
            )}
            <div className="relative flex w-full flex-col items-start overflow-hidden md:rounded-lg md:border md:border-section-border md:bg-background">
                {selectable && bulkActions && selectedCount > 0 && (
                    <div
                        aria-label="Bulk actions"
                        role="group"
                        className="z-10 flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-section-border bg-table-header px-4 py-2 md:absolute md:inset-x-0 md:top-0 md:h-10 md:flex-nowrap md:rounded-none md:border-0 md:px-5 md:py-0"
                    >
                        <div className="flex items-center gap-3">
                            <SelectAllCheckbox />
                            <span className="text-sm font-medium" aria-live="polite">
                                {selectedCount} selected
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="ghost" size="xs" onClick={() => setSelectedIds(new Set())}>
                                Clear
                            </Button>
                            {bulkActions(selectedRows, (ids) => selectRows(ids, false))}
                        </div>
                    </div>
                )}
                <Table className="block md:table">
                    <TableHeader className="hidden md:table-header-group [&_tr]:border-b-0">
                        <TableRow className="bg-table-header hover:bg-section-bg border-0 rounded-[10px]">
                            {selectable && (
                                <TableHead className="w-14 px-5 py-2.5">
                                    <SelectAllCheckbox />
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
                        {displayedData.map((row, rowIndex) => (
                            <TableRow
                                key={displayedRowIds[rowIndex]}
                                className="grid grid-cols-2 overflow-hidden rounded-lg border! border-section-border bg-card-nested px-2 py-0 hover:bg-card-nested md:table-row md:rounded-none md:border-0! md:bg-transparent md:p-0 md:hover:bg-transparent"
                            >
                                {selectable && (
                                    <TableCell className="col-span-2 border-b border-section-border px-1 py-2 md:border-0 md:px-5">
                                        <Checkbox
                                            aria-label={`Select ${row.name ?? displayedRowIds[rowIndex]}`}
                                            checked={selectedIds.has(displayedRowIds[rowIndex])}
                                            onCheckedChange={(checked) => selectRows([displayedRowIds[rowIndex]], checked)}
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

                {pagination && data.length > 0 && (
                    <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-section-border px-4 py-3 text-sm text-muted-foreground md:px-5">
                        <span>
                            Showing {totalItems === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + displayedData.length, totalItems)} of {totalItems}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="bare"
                                size="xs"
                                aria-label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => changePage(currentPage - 1)}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <span className="px-2 text-foreground">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="bare"
                                size="xs"
                                aria-label="Next page"
                                disabled={currentPage === totalPages}
                                onClick={() => changePage(currentPage + 1)}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {data.length === 0 && (
                    emptyState ?? (
                        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-section-border bg-card-nested px-4 py-10 text-center md:rounded-none md:border-0 md:py-16">
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
