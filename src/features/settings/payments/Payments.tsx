import { CreditCard, Download, ExternalLink } from "lucide-react";
import { format as formatDate } from "date-fns";
import AppSection from "@/components/design/AppSectoin";
import CustomTable, { type Column } from "@/components/design/CustomTable";
import Heading from "@/components/design/Heading";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCan } from "@/features/auth";
import { openBillingPortal } from "@/features/settings/plan/planApi";
import { usePaymentsQuery, type Invoice } from "./paymentsApi";

const STATUS: Record<string, { label: string; variant: "default" | "warning" | "destructive" | "darkOutline" }> = {
    paid: { label: "Paid", variant: "default" },
    open: { label: "Due", variant: "warning" },
    uncollectible: { label: "Failed", variant: "destructive" },
    void: { label: "Void", variant: "darkOutline" },
    draft: { label: "Draft", variant: "darkOutline" },
};

function money(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

const columns: Column[] = [
    {
        key: "number",
        header: "Invoice",
        width: "220px",
        render: (value) => <span className="font-medium">{value ? String(value) : "—"}</span>,
    },
    {
        key: "createdAt",
        header: "Date",
        render: (value) => formatDate(new Date(String(value)), "MMM d, yyyy"),
    },
    {
        key: "status",
        header: "Status",
        render: (value) => {
            const status = STATUS[String(value)] ?? { label: String(value ?? "—"), variant: "darkOutline" as const };
            return <Badge variant={status.variant}>{status.label}</Badge>;
        },
    },
    {
        key: "amountDue",
        header: "Amount",
        align: "right",
        render: (value, row) => <span className="tabular">{money(Number(value), String(row.currency))}</span>,
    },
];

/** Settings > Payments: what Stripe has billed, and the card it charges. Changes happen in Stripe. */
export function Payments() {
    const { data, isLoading, isError } = usePaymentsQuery();
    const canManage = useCan("settings.payments.create");
    const card = data?.paymentMethod;

    if (isError) {
        return (
            <AppSection>
                <Heading size="lg">Payments</Heading>
                <p className="text-base text-muted-foreground">Only the account owner can see invoices and payment details.</p>
            </AppSection>
        );
    }

    return (
        <>
            <AppSection>
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div>
                        <Heading size="lg">Payment method</Heading>
                        <p className="mt-0.5 text-sm text-muted-foreground">Cards are stored and charged by Stripe; 11xSales never sees the full number.</p>
                    </div>
                    {canManage && card && (
                        <Button variant="outline" size="sm" onClick={() => openBillingPortal().catch(() => undefined)}>
                            Update in Stripe
                            <ExternalLink className="size-3.5" />
                        </Button>
                    )}
                </div>
                <div className="flex w-full items-center gap-3 rounded-lg border border-border-subtle bg-surface-subtle p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-muted-foreground shadow-panel">
                        <CreditCard className="size-5" aria-hidden="true" />
                    </span>
                    {isLoading ? (
                        <span className="text-base text-muted-foreground">Loading…</span>
                    ) : card ? (
                        <span className="flex flex-col">
                            <span className="text-base font-medium capitalize text-foreground">
                                {card.brand} •••• {card.last4}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                            </span>
                        </span>
                    ) : (
                        <span className="flex flex-col">
                            <span className="text-base font-medium text-foreground">No card on file</span>
                            <span className="text-sm text-muted-foreground">You'll add one when you upgrade from the Plan tab.</span>
                        </span>
                    )}
                </div>
            </AppSection>

            <CustomTable
                title="Invoices"
                description="Every charge for your plan, newest first."
                columns={columns}
                data={(data?.invoices ?? []) as unknown as Record<string, unknown>[]}
                emptyMessage="No invoices yet"
                emptyDescription="Invoices appear here after your first payment."
                emptyState={isLoading ? <TableSkeleton columns={4} showHeader={false} /> : undefined}
                rowActions={(row) => {
                    const invoice = row as unknown as Invoice;
                    return (
                        <div className="flex items-center gap-1">
                            {invoice.pdfUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    nativeButton={false}
                                    render={<a href={invoice.pdfUrl} target="_blank" rel="noreferrer" aria-label={`Download invoice ${invoice.number ?? ""} as PDF`} />}
                                >
                                    <Download className="size-4" />
                                </Button>
                            )}
                            {invoice.hostedInvoiceUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    nativeButton={false}
                                    render={<a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer" aria-label={`Open invoice ${invoice.number ?? ""}`} />}
                                >
                                    <ExternalLink className="size-4" />
                                </Button>
                            )}
                        </div>
                    );
                }}
            />
        </>
    );
}
