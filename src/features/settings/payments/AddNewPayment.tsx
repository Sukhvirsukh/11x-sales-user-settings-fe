import AppSection from "@/components/design/AppSectoin";
import { CustomTabs } from "@/components/design/CustomTabs";
import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Label from "@/components/design/Label";
import Modal from "@/components/design/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useId, useState } from "react";


const tabs = [
    { id: "account", label: "Account" },
    { id: "card", label: "Card" }
];


export function AccountPayment() {
    return (
        <FormGroup gap="sm">
            <InputField
                label="Store Name"
                placeholder="Enter store name"
                labelClassName="text-sm font-medium"
            />
            <InputField
                label="Store URL"
                placeholder="Enter store URL"
                labelClassName="text-sm font-medium"
            />
        </FormGroup>
    )
}

export function CardPayment() {
    const defaultPaymentId = useId();
    const otherOfferId = useId();

    return (
        <FormGroup gap="sm">
            <InputField
                label="Name"
                placeholder="Enter name"
                labelClassName="text-sm font-medium"
            />
            <InputField
                label="Card number"
                type="number"
                placeholder="Enter card number"
                labelClassName="text-sm font-medium"
            />

            <FormGroup col={2} gap="sm">
                <DatePicker
                    label="Expire date"
                    placeholder="Select date"
                    labelClassName="text-sm font-medium"
                />
                <InputField
                    label="CVV"
                    placeholder="Enter CVV"
                    labelClassName="text-sm font-medium"
                />

            </FormGroup>

            <div className="flex items-center gap-2">
                <Checkbox
                    id={defaultPaymentId}
                    name="defaultPaymentMethod"
                />
                <Label htmlFor={defaultPaymentId} className="cursor-pointer text-sm text-content-muted">
                    Save as default payment method
                </Label>
            </div>
            <AppSection className="h-auto gap-2.5 rounded-[4px] bg-table-header-background">
                <dl className="flex w-full flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-content-muted">Total charges</dt>
                        <dd className="">INR 650</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-content-muted">Apply offer</dt>
                        <dd className="">INR 65</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <dt>
                            <Label htmlFor={otherOfferId} className="text-sm font-normal text-content-muted">
                                Other offer
                            </Label>
                        </dt>
                        <dd className="w-[68px] shrink-0">
                            <InputField
                                id={otherOfferId}
                                name="otherOffer"
                                placeholder="Enter here"
                                containerClassName="h-[22px] rounded-[6px] border-content-muted px-2"
                                className="text-xs placeholder:text-content-muted"
                            />
                        </dd>
                    </div>
                </dl>
                <Separator className="bg-primary/30" />
                <dl className="flex w-full items-center justify-between gap-3 text-sm">
                    <dt className="text-content-muted">Total payment</dt>
                    <dd className="">INR 600</dd>
                </dl>
            </AppSection>
        </FormGroup>
    )
}

export default function AddNewPayment() {

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <Modal
            trigger={
                <Button variant="primary" className="">
                    New Payment
                    <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                </Button>
            }
            title="Edit details"
            primaryAction={{
                label: "Save",
                onClick: () => console.log("Save"),
            }}
            closeAction={{
                label: "Cancel",
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
                        <AccountPayment />
                    ) : (
                        <CardPayment />
                    )
                }

            </CustomTabs>

        </Modal>
    )
}
