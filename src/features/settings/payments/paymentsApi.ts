import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface Invoice {
    id: string;
    number: string | null;
    status: string | null;
    amountDue: number;
    amountPaid: number;
    currency: string;
    createdAt: string;
    hostedInvoiceUrl: string | null;
    pdfUrl: string | null;
}

export interface SavedCard {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
}

export interface PaymentsResponse {
    invoices: Invoice[];
    paymentMethod: SavedCard | null;
}

/** The account's Stripe invoices and saved card (11xSales backend: /billing/payments). */
export function usePaymentsQuery() {
    return useQuery({
        queryKey: ["admin", "payments"],
        queryFn: () => apiFetch<PaymentsResponse>("/billing/payments", { notifyOnError: false }),
    });
}
