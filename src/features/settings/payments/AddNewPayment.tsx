import { CustomTabs } from "@/components/design/CustomTabs";
import Modal from "@/components/design/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AccountDetailForm from "./AccountDetailForm";
import CardDetailForm from "./CardDetailForm";
import { addPaymentMethod } from "./paymentsApi";
import { paymentAccountSchema, paymentCardSchema } from "./paymentSchema";
import { paymentHistoryQueryKey } from "./paymentsQuery";
import type { CreateAccountPaymentRequest, CreateCardPaymentRequest } from "./paymentsType";


const tabs = [
    { id: "account", label: "Account" },
    { id: "card", label: "Card" }
];

const PAYMENT_AMOUNT = 600;

const ACCOUNT_DEFAULT_VALUES: CreateAccountPaymentRequest = {
    method: "AMOUNT",
    amount: PAYMENT_AMOUNT,
    name: "",
    accountNumber: "",
    saveAsDefault: false,
};

const CARD_DEFAULT_VALUES: CreateCardPaymentRequest = {
    method: "CARD",
    amount: PAYMENT_AMOUNT,
    cardName: "",
    cardNumber: "",
    cardType: "",
    expiryMonth: 0,
    expiryYear: 0,
    cvv: "",
    saveAsDefault: false,
};

export default function AddNewPayment() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const accountForm = useForm<CreateAccountPaymentRequest>({
        resolver: zodResolver(paymentAccountSchema),
        defaultValues: ACCOUNT_DEFAULT_VALUES,
    });
    const cardForm = useForm<CreateCardPaymentRequest>({
        resolver: zodResolver(paymentCardSchema),
        defaultValues: CARD_DEFAULT_VALUES,
    });

    const addPaymentMutation = useMutation({
        mutationFn: addPaymentMethod,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: paymentHistoryQueryKey });
            accountForm.reset(ACCOUNT_DEFAULT_VALUES);
            cardForm.reset(CARD_DEFAULT_VALUES);
            setActiveTab(tabs[0].id);
            setOpen(false);
            toast.add({
                type: "success",
                title: "Payment added",
                description: "The payment method has been added successfully.",
            });
        },
    });

    const submitAccount: SubmitHandler<CreateAccountPaymentRequest> = (values) => {
        addPaymentMutation.mutate(values);
    };

    const submitCard: SubmitHandler<CreateCardPaymentRequest> = (values) => {
        addPaymentMutation.mutate(values);
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (addPaymentMutation.isPending) return;

        setActiveTab(tabs[0].id);
        accountForm.reset(ACCOUNT_DEFAULT_VALUES);
        cardForm.reset(CARD_DEFAULT_VALUES);
        setOpen(nextOpen);
    };

    const submitActiveForm = activeTab === "account"
        ? accountForm.handleSubmit(submitAccount)
        : cardForm.handleSubmit(submitCard);

    return (
        <Modal
            open={open}
            onOpenChange={handleOpenChange}
            trigger={
                <Button variant="primary">
                    New Payment
                    <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                </Button>
            }
            title="New payment"
            primaryAction={{
                label: addPaymentMutation.isPending ? "Saving..." : "Save",
                onClick: submitActiveForm,
                disabled: addPaymentMutation.isPending,
            }}
            closeAction={{
                label: "Cancel",
                disabled: addPaymentMutation.isPending,
            }}
        >
            <CustomTabs
                tabs={tabs.map(({ id, label }) => ({ id, label }))}
                value={activeTab}
                onValueChange={handleTabChange}
                listClassName="pl-[4px]"
                className="p-0! gap-3.5"
            >

                {
                    activeTab === "account" ? (
                        <AccountDetailForm
                            form={accountForm}
                            onSubmit={submitAccount}
                            disabled={addPaymentMutation.isPending}
                        />
                    ) : (
                        <CardDetailForm
                            amount={PAYMENT_AMOUNT}
                            form={cardForm}
                            onSubmit={submitCard}
                            disabled={addPaymentMutation.isPending}
                        />
                    )
                }

            </CustomTabs>

        </Modal>
    )
}
