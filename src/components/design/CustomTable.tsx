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
    return (
        <AppSection>
            {/* Header bar */}
            {(title || headerActions) && (
                <div className="flex justify-between items-center w-full">
                    {title && (
                        <Heading size="md" className="leading-none">
                            {title}
                        </Heading>
                    )}
                    {headerActions && <div>{headerActions}</div>}
                </div>
            )}

            {/* Table */}
            <div className="flex flex-col items-start rounded-lg border border-section-border bg-background w-full overflow-hidden">
                <Table>
                    <TableHeader >
                        <TableRow className="bg-table-header hover:bg-section-bg border-0 rounded-[10px]">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`text-sm  px-5 py-2.5 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                            {rowActions && (
                                <TableHead className="text-sm px-5 py-2.5 text-right w-28.25">
                                    Action
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className="border-0 hover:bg-transparent"
                            >
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className={`text-sm text-black py-2 px-5 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                                    >
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key] ?? "")}
                                    </TableCell>
                                ))}
                                {rowActions && (
                                    <TableCell className="text-sm text-black py-2 px-5 text-right">
                                        <div className="flex justify-end items-center">
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
