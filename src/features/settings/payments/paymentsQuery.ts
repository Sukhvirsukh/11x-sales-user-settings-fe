import { useQuery } from "@tanstack/react-query"
import { getPaymentHistory } from "./paymentsApi"



export const paymentHistoryQueryKey = ["paymentHistory"]

export const usePaymentHistoryQuery = () => {
    return useQuery({
        queryKey: paymentHistoryQueryKey,
        queryFn: getPaymentHistory
    })
}