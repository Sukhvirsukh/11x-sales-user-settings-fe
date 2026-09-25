import PaymentHistory from "./PaymentHistory";
import { usePaymentHistoryQuery } from "./paymentsQuery";
import SavedPaymentDetails from "./SavedPaymentDetails";



export function Payments() {

    const { data: paymentHistoryQuery, isLoading, error } = usePaymentHistoryQuery()

    if (error) throw error

    return (
        <>
            <PaymentHistory
                data={paymentHistoryQuery}
                isLoading={isLoading}
            />

            <SavedPaymentDetails
                data={paymentHistoryQuery}
                isLoading={isLoading}
            />
        </>
    )
}
