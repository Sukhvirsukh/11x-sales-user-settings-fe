import PaymentHistory from "./PaymentHistory";
import SavedPaymentDetails from "./SavedPaymentDetails";



export function Payments() {
    return (
        <div className="flex flex-col items-start gap-3.5 pb-5 pt-2">
            <div className="flex p-4 flex-col items-start gap-3.5 rounded-[10px] border border-blue-100/70 bg-white shadow-blue w-full overflow-hidden">

                <PaymentHistory />

                <SavedPaymentDetails />
            </div>
        </div>
    )
}
