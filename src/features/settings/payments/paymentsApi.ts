import { apiFetch } from "@/lib/api";
import type { CreatePaymentRequest, PaymentHistoryResponse } from "./paymentsType";



export async function getPaymentHistory() {
    const response = await apiFetch<PaymentHistoryResponse>("/admin/payment-methods");
    return response
}


export function addPaymentMethod(payment: CreatePaymentRequest) {
    return apiFetch<unknown>("/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
    });
}
