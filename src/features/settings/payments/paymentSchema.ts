import z from "zod";
import type { CreateAccountPaymentRequest, CreateCardPaymentRequest } from "./paymentsType";

const currentYear = new Date().getFullYear();
const maximumExpiryYear = currentYear + 30;

function passesLuhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
        let digit = Number(cardNumber[index]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

const cardNumberSchema = z.string()
    .trim()
    .min(1, "Card number is required")
    .transform((value) => value.replace(/[\s-]/g, ""))
    .superRefine((value, context) => {
        if (!value) return;

        if (!/^\d+$/.test(value)) {
            context.addIssue({
                code: "custom",
                message: "Card number must contain only digits",
            });
            return;
        }

        if (value.length < 13 || value.length > 19) {
            context.addIssue({
                code: "custom",
                message: "Card number must be between 13 and 19 digits",
            });
            return;
        }

        if (!passesLuhnCheck(value)) {
            context.addIssue({
                code: "custom",
                message: "Enter a valid card number",
            });
        }
    });

export const paymentCardSchema: z.ZodType<CreateCardPaymentRequest, CreateCardPaymentRequest> = z.object({
    method: z.literal("CARD"),
    amount: z.number().positive("Amount must be greater than 0"),
    offerApplied: z.number().nonnegative("Offer must be 0 or greater").optional(),
    cardName: z.string()
        .trim()
        .min(1, "Cardholder name is required")
        .min(2, "Cardholder name must contain at least 2 characters")
        .max(100, "Cardholder name must contain at most 100 characters"),
    cardNumber: cardNumberSchema,
    cardType: z.string()
        .trim()
        .min(1, "Card type is required")
        .max(30, "Card type must contain at most 30 characters"),
    expiryMonth: z.number()
        .int("Expiry month must be a whole number")
        .min(1, "Expiry month must be between 1 and 12")
        .max(12, "Expiry month must be between 1 and 12"),
    expiryYear: z.number()
        .int("Expiry year must be a whole number")
        .min(currentYear, "Card has expired")
        .max(maximumExpiryYear, `Expiry year cannot be later than ${maximumExpiryYear}`),
    cvv: z.string()
        .trim()
        .min(1, "CVV is required")
        .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    saveAsDefault: z.boolean(),
}).superRefine(({ expiryMonth, expiryYear }, context) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear === now.getFullYear() && expiryMonth < currentMonth) {
        context.addIssue({
            code: "custom",
            path: ["expiryMonth"],
            message: "Card has expired",
        });
    }
});

const accountNumberSchema = z.string()
    .trim()
    .min(1, "Account number is required")
    .transform((value) => value.replace(/[\s-]/g, ""))
    .superRefine((value, context) => {
        if (!value) return;

        if (!/^\d+$/.test(value)) {
            context.addIssue({
                code: "custom",
                message: "Account number must contain only digits",
            });
            return;
        }

        if (value.length < 6 || value.length > 34) {
            context.addIssue({
                code: "custom",
                message: "Account number must be between 6 and 34 digits",
            });
        }
    });

export const paymentAccountSchema: z.ZodType<CreateAccountPaymentRequest, CreateAccountPaymentRequest> = z.object({
    method: z.literal("AMOUNT"),
    amount: z.number().positive("Amount must be greater than 0"),
    offerApplied: z.number().nonnegative("Offer must be 0 or greater").optional(),
    name: z.string()
        .trim()
        .min(1, "Account holder name is required")
        .min(2, "Account holder name must contain at least 2 characters")
        .max(100, "Account holder name must contain at most 100 characters"),
    accountNumber: accountNumberSchema,
    saveAsDefault: z.boolean(),
});
