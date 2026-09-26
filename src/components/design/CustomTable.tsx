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
import { cn } from "@/lib/utils"

export interface Column {
    key: string
    header: string
    /** Desktop column width hint, e.g. `"280px"`. Also marks the column as the mobile lead. */
    width?: string
    /**
     * Mobile-only width for this column's line slot, e.g. `"70%"`; the paired cell takes the
     * remaining room. Wins over the table's `mobileColumnSplit` for the side this column sits on.
     */
    mobileWidth?: string
    align?: "left" | "right" | "center"
    render?: (value: unknown, row: Record<string, unknown>) => ReactNode
}

/** Share of a mobile line given to the side holding the lead column. */
const MOBILE_LEAD_SHARE = "65%"
/** Every other mobile track takes whatever room is left. */
const MOBILE_FILL = "minmax(0, 1fr)"

/** Highest page count that still lists every page number instead of collapsing the gaps. */
const MAX_VISIBLE_PAGES = 5
/** Pages kept on each side of the current page before the run collapses into dots. */
const PAGE_SIBLINGS = 1

/** A page number, or a collapsed run of pages between two numbers. */
type PageItem = number | "ellipsis"

/**
 * Page numbers to render. Up to `MAX_VISIBLE_PAGES` pages are all listed; past that the current
 * page keeps `PAGE_SIBLINGS` neighbours, the first and last page stay reachable, and every skipped
 * run becomes a single `"ellipsis"` — e.g. `1 2 3 … 9` or `1 … 4 5 6 … 9`.
 */
function getPageItems(currentPage: number, totalPages: number): PageItem[] {
    if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const runLength = PAGE_SIBLINGS * 2 + 1
    const runStart = Math.min(Math.max(currentPage - PAGE_SIBLINGS, 1), totalPages - runLength + 1)
    const runEnd = runStart + runLength - 1
    const items: PageItem[] = []

    // One skipped page is clearer shown as a number than as dots.
    if (runStart > 2) items.push(1, "ellipsis")
    else for (let page = 1; page < runStart; page += 1) items.push(page)

    for (let page = runStart; page <= runEnd; page += 1) items.push(page)

    if (runEnd < totalPages - 1) items.push("ellipsis", totalPages)
    else for (let page = runEnd + 1; page <= totalPages; page += 1) items.push(page)

    return items
}

type CustomTableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
    title?: string
    /** Optional supporting line rendered under the title. */
    description?: string
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
    /**
     * Mobile-only widths of the two cells paired on each line, e.g. `["65%", "35%"]` or
     * `["50%", "50%"]` for an even split. Defaults to giving the mobile lead column
     * `MOBILE_LEAD_SHARE`.
     */
    mobileColumnSplit?: [string, string]
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
    cursorPagination?: {
        hasPrevious: boolean
        hasNext: boolean
        onPrevious: () => void
        onNext: () => void
    }
} & (
        | { selectable: true; getRowId: (row: T) => string | number }
        | { selectable?: false; getRowId?: (row: T) => string | number }
    )

export default function CustomTable<T extends Record<string, unknown>>({
    title,
    description,
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
    cursorPagination,
    mobileColumnSplit,
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
    /**
     * Below `md` every row is a two-column grid, so each track is resolved per side: the column's
     * own `mobileWidth`, then the table's `mobileColumnSplit`, then the wider `MOBILE_LEAD_SHARE`
     * for whichever side holds the lead column (the first one given a desktop `width`).
     */
    const leadMobileIndex = mobileColumns.findIndex((col) => col.width)
    const mobileTrack = (side: 0 | 1) =>
        mobileColumns.find((col, index) => index % 2 === side && col.mobileWidth)?.mobileWidth ??
        mobileColumnSplit?.[side] ??
        (leadMobileIndex >= 0 && leadMobileIndex % 2 === side ? MOBILE_LEAD_SHARE : MOBILE_FILL)
    const mobileTracks = [mobileTrack(0), mobileTrack(1)]
    // `gridTemplateColumns` is inert once `md:table-row` turns the row back into a real table row.
    const mobileRowStyle = mobileTracks.every((track) => track === MOBILE_FILL)
        ? undefined
        : { gridTemplateColumns: mobileTracks.join(" ") }

    return (
        <AppSection className={className}>
            {/* Header bar */}
            {(title || description || headerActions) && (
                <div className="flex flex-wrap justify-between items-center gap-2 w-full">
                    {(title || description) && (
                        <div className="min-w-0">
                            {title && (
                                <Heading size="md" className="text-[14px] md:text-[16px] leading-none">
                                    {title}
                                </Heading>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                    )}
                    {headerActions && <div className="min-w-0 max-w-full">{headerActions}</div>}
                </div>
            )}

            {/* Table */}
            <div className="relative flex w-full flex-col items-start overflow-hidden md:rounded-lg md:border md:border-section-border md:bg-background">
                {selectable && bulkActions && selectedCount > 0 && (
                    <div
                        aria-label="Bulk actions"
                        role="group"
                        className="z-10 flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-section-border bg-table-header-background px-4 py-2 md:absolute md:inset-x-0 md:top-0 md:h-10 md:flex-nowrap md:rounded-none md:border-0 md:px-5 md:py-0"
                    >
                        <div className="flex items-center gap-3">
                            <span className="hidden md:inline-flex">
                                <SelectAllCheckbox />
                            </span>
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
                        <TableRow className="bg-table-header-background hover:bg-section-background border-0 rounded-[10px]">
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
                                style={mobileRowStyle}
                                className="grid grid-cols-2 overflow-hidden rounded-lg border! border-section-border bg-surface-raised px-2 py-0 hover:bg-surface-raised md:table-row md:rounded-none md:border-0! md:bg-transparent md:p-0 md:hover:bg-transparent"
                            >
                                {selectable && (
                                    <TableCell className="hidden md:table-cell md:border-0 md:px-5">
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
                                        className={`${col.key === "select" ? "hidden" : "block"} min-w-0 whitespace-normal break-words ${mobileColumns.indexOf(col) < lastMobileRowStart ? "border-b" : "border-b-0"} border-section-border px-1 py-2 text-left text-[14px] font-normal text-content-strong md:table-cell md:border-0 md:whitespace-nowrap md:px-5 ${col.align === "right" ? "md:text-right" : col.align === "center" ? "md:text-center" : "md:text-left"}`}
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
                                    <TableCell className="block min-w-0 px-1 py-2 text-left text-[14px] font-normal text-content-strong md:table-cell md:px-5 md:text-right">
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

                {((pagination && data.length > 0 && totalPages > 1) ||
                    (cursorPagination && (cursorPagination.hasPrevious || cursorPagination.hasNext))) && (
                    <nav
                        aria-label="Pagination"
                        className="flex w-full flex-wrap items-center justify-center gap-3 border-t border-section-border px-4 py-3 text-sm text-muted-foreground md:px-5"
                    >
                        {/* <span>
                            Showing {totalItems === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + displayedData.length, totalItems)} of {totalItems}
                        </span> */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="primary"
                                size="xs"
                                className='p-1'
                                aria-label="Previous page"
                                disabled={cursorPagination ? !cursorPagination.hasPrevious : currentPage === 1}
                                onClick={() => cursorPagination ? cursorPagination.onPrevious() : changePage(currentPage - 1)}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            {!cursorPagination && getPageItems(currentPage, totalPages).map((item, index) =>
                                item === "ellipsis" ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        aria-hidden="true"
                                        className="px-1 text-content-muted"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <Button
                                        key={item}
                                        variant={item === currentPage ? "primary" : "secondary"}
                                        size="xs"
                                        className={cn(
                                            "min-w-7 px-1.5",
                                            item !== currentPage && "border-0",
                                        )}
                                        aria-label={`Page ${item}`}
                                        aria-current={item === currentPage ? "page" : undefined}
                                        onClick={() => changePage(item)}
                                    >
                                        {item}
                                    </Button>
                                ),
                            )}
                            <Button
                                variant="primary"
                                size="xs"
                                className="p-1"
                                aria-label="Next page"
                                disabled={cursorPagination ? !cursorPagination.hasNext : currentPage === totalPages}
                                onClick={() => cursorPagination ? cursorPagination.onNext() : changePage(currentPage + 1)}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </nav>
                )}

                {/* Empty state */}
                {data.length === 0 && (
                    emptyState ?? (
                        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-section-border bg-surface-raised px-4 py-10 text-center md:rounded-none md:border-0 md:py-16">
                            <span className="flex size-10 items-center justify-center rounded-full bg-section-background text-primary">
                                <Inbox aria-hidden="true" className="size-5" />
                            </span>
                            <p className="text-sm font-medium text-content-strong">{emptyMessage}</p>
                            <p className="text-sm text-content-muted">{emptyDescription}</p>
                            {emptyStateAction && <div className="mt-2">{emptyStateAction}</div>}
                        </div>
                    )
                )}
            </div>
        </AppSection>
    )
}
