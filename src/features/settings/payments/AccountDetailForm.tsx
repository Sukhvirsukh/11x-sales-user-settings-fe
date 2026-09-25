import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Label from "@/components/design/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";
import { Controller, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { CreateAccountPaymentRequest } from "./paymentsType";

export type AccountDetailFormProps = {
    disabled: boolean;
    form: UseFormReturn<CreateAccountPaymentRequest>;
    onSubmit: SubmitHandler<CreateAccountPaymentRequest>;
};

export default function AccountDetailForm({ disabled, form, onSubmit }: AccountDetailFormProps) {
    const defaultPaymentId = useId();
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={disabled}>
            <FormGroup gap="sm">
                <InputField
                    label="Name"
                    placeholder="Enter account holder name"
                    labelClassName="text-sm font-medium"
                    autoComplete="name"
                    disabled={disabled}
                    error={errors.name?.message}
                    {...register("name")}
                />
                <InputField
                    label="Account number"
                    placeholder="Enter account number"
                    labelClassName="text-sm font-medium"
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={disabled}
                    error={errors.accountNumber?.message}
                    {...register("accountNumber")}
                />
                <Controller
                    name="saveAsDefault"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={defaultPaymentId}
                                checked={field.value}
                                disabled={disabled}
                                onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={defaultPaymentId} className="cursor-pointer text-sm text-content-muted">
                                Save as default payment method
                            </Label>
                        </div>
                    )}
                />
            </FormGroup>
        </form>
    )
}
