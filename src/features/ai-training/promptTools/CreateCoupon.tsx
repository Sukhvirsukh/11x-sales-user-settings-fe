import { useState } from "react";

import ActionModal from "./ActionModal";

type CreateCouponValues = {
    couponCode: string;
    minimumDiscount: string;
    additionalInformation: string;
};

const DEFAULT_VALUES: CreateCouponValues = {
    couponCode: "",
    minimumDiscount: "",
    additionalInformation: "",
};

/**
 * Create discount tool — owns its draft, its switch and its create request.
 *
 * The coupon is not part of the prompt-tools document, so this component keeps
 * both the created values and the switch on its own.
 */
export default function CreateCoupon() {
    const [savedValues, setSavedValues] = useState<CreateCouponValues>(DEFAULT_VALUES);
    const [enabled, setEnabled] = useState(false);

    function createCoupon(values: CreateCouponValues, isEnabled: boolean) {
        // The create-coupon request goes here once the API exposes it; keeping
        // the values makes the dialog reopen on what was last created.
        setSavedValues(values);
        setEnabled(isEnabled);
        return true;
    }

    return (
        <ActionModal<CreateCouponValues>
            title="Create coupon"
            heading="Create discount"
            content="Allow Vitalb to create discount inside the site"
            saveLabel="Create"
            fields={[
                {
                    name: "couponCode",
                    label: "Coupon code",
                    placeholder: "Enter coupon code",
                    kind: "input",
                },
                {
                    name: "minimumDiscount",
                    label: "Minimum allowed discount",
                    placeholder: "Enter percentage (max file 100%)",
                    kind: "input",
                },
                {
                    name: "additionalInformation",
                    label: "Additional information",
                    placeholder: "Enter additional information",
                },
            ]}
            corePrompts={{
                title: "Core prompt",
                items: [
                    "Use this skill to create a unique, one time percentage discount for the customer.",
                    "You can create a discount to encourage the user to purchase more",
                ],
            }}
            defaultValues={savedValues}
            isChecked={enabled}
            onSave={createCoupon}
        />
    );
}
