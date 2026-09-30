import { useState } from "react";
// import { useFormContext } from "react-hook-form";

import Modal from "@/components/design/Modal";
import { ActionCard } from "./PromptTools";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { TextAreaField } from "@/components/design/TextAreaField";
import List from "@/components/shared/List";

export default function CreateCoupon() {
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    // const { watch } = useFormContext();

    const createDiscount = () => {
        setIsDiscountModalOpen(true)

    }

    const closeModal = () => {
        setIsDiscountModalOpen(false)
    }

    const createCoupon = () => {
        closeModal()
    }

    return (
        <Modal
            open={isDiscountModalOpen}
            onOpenChange={setIsDiscountModalOpen}
            title="Create coupon"
            primaryAction={{
                label: "Create",
                onClick: createCoupon
            }}
            secondaryAction={{
                label: "Cancel",
                onClick: closeModal
            }}
            trigger={
                <ActionCard
                    heading="Create discount"
                    content="Allow Vitalb to create discount inside the site"
                    // isChecked={watch("discountEnabled")}
                    onToggle={createDiscount}
                />
            }
        >
            <FormGroup>
                <InputField
                    label="Coupon code"
                    placeholder="Enter coupon code"
                    labelClassName="text-sm font-medium"
                // error={errors.name?.message}
                // {...register("name")}
                />
                <InputField
                    label="Minimum allowed discount"
                    placeholder="Enter percentage (max file 100%)"
                    labelClassName="text-sm font-medium"
                // error={errors.name?.message}
                // {...register("name")}
                />
                <TextAreaField
                    label="Additional information"
                    placeholder="Enter additional information"
                    labelClassName="text-sm font-medium"
                />

                <div>
                    <List
                        title="Core prompt"
                        titleClassName="text-sm font-medium"
                        listClassName="text-sm text-content-muted space-y-0 disc list-disc pl-2"
                        listItemClassName="my-0"
                        list={[
                            "Use this skill to create a unique, one time percentage discount for the customer.",
                            "You can create a discount to encourage the user to purchase more"
                        ]}
                    />

                </div>
            </FormGroup>
        </Modal>
    )
}
