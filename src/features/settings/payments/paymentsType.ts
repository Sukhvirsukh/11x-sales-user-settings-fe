export type PaymentMethod = "CARD" | "AMOUNT"
export type PaymentStatus = "Active" | "Inactive"

type PaymentAmount = {
    amount: number
}

/** A payment record returned for the payment-history table. */
export type PaymentHistoryItem = PaymentAmount & {
    invoiceNumber: string
    status: PaymentStatus
    startDate: string
    method: PaymentMethod
}

type PaymentInputPreferences = {
    saveAsDefault: boolean
}

export type CardPaymentInput = PaymentInputPreferences & {
    method: "CARD"
    cardName: string
    cardNumber: string
    cardType: string
    expiryMonth: number
    expiryYear: number
    cvv: string
}

export type AccountPaymentInput = PaymentInputPreferences & {
    method: "AMOUNT"
    name: string
    accountNumber: string
}

type CreatePaymentDetails = PaymentAmount & {
    offerApplied?: number
}

export type CreateCardPaymentRequest = CreatePaymentDetails & CardPaymentInput
export type CreateAccountPaymentRequest = CreatePaymentDetails & AccountPaymentInput

/** Payload accepted when creating a card or account payment. */
export type CreatePaymentRequest = CreateCardPaymentRequest | CreateAccountPaymentRequest

export type PaymentHistoryResponse = PaymentHistoryItem[]
