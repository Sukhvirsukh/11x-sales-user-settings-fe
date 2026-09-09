import type { ReactNode } from "react"
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

export interface Column {
    key: string
    header: string
    width?: string
    align?: "left" | "right" | "center"
    render?: (value: unknown, row: Record<string, unknown>) => ReactNode
}

interface CustomTableProps {
    title?: string
    columns: Column[]
    data: Record<string, unknown>[]
    headerActions?: ReactNode
    rowActions?: (row: Record<string, unknown>) => ReactNode
    className?: string
}

export default function CustomTable({
    title,
    columns,
    data,
    headerActions,
    rowActions,
    className,
}: CustomTableProps) {
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
            <div className="flex flex-col items-start md:rounded-lg md:border md:border-section-border md:bg-background w-full overflow-hidden">
                <Table className="block md:table">
                    <TableHeader className="hidden md:table-header-group [&_tr]:border-b-0">
                        <TableRow className="bg-table-header hover:bg-section-bg border-0 rounded-[10px]">
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
                                key={rowIndex}
                                className="grid grid-cols-2 overflow-hidden rounded-lg border! border-section-border bg-white px-2 py-0 md:table-row md:rounded-none md:border-0! md:bg-transparent md:p-0 hover:bg-white md:hover:bg-transparent"
                            >
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
            </div>
        </AppSection>
    )
}
