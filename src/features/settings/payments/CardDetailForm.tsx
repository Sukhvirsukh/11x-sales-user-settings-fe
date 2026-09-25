import AppSection from "@/components/design/AppSectoin";
import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Label from "@/components/design/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useId } from "react";
import { Controller, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { CreateCardPaymentRequest } from "./paymentsType";

export type CardDetailFormProps = {
    amount: number;
    disabled: boolean;
    form: UseFormReturn<CreateCardPaymentRequest>;
    onSubmit: SubmitHandler<CreateCardPaymentRequest>;
};

export default function CardDetailForm({ amount, disabled, form, onSubmit }: CardDetailFormProps) {
    const defaultPaymentId = useId();
    const otherOfferId = useId();
    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;
    const expiryMonth = watch("expiryMonth");
    const expiryYear = watch("expiryYear");
    const expiryDate = expiryMonth >= 1 && expiryMonth <= 12 && expiryYear > 0
        ? new Date(expiryYear, expiryMonth - 1, 1)
        : undefined;
    const expiryError = errors.expiryMonth?.message ?? errors.expiryYear?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={disabled}>
            <FormGroup gap="sm">
                <InputField
                    label="Name"
                    placeholder="Enter cardholder name"
                    labelClassName="text-sm font-medium"
                    autoComplete="cc-name"
                    disabled={disabled}
                    error={errors.cardName?.message}
                    {...register("cardName")}
                />
                <InputField
                    label="Card number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={23}
                    placeholder="Enter card number"
                    labelClassName="text-sm font-medium"
                    disabled={disabled}
                    error={errors.cardNumber?.message}
                    {...register("cardNumber")}
                />
                <InputField
                    label="Card type"
                    placeholder="For example, Visa"
                    labelClassName="text-sm font-medium"
                    disabled={disabled}
                    error={errors.cardType?.message}
                    {...register("cardType")}
                />

                <FormGroup col={2} gap="sm">
                    <DatePicker
                        label="Expiry date"
                        placeholder="Select date"
                        dateFormat="MM/yyyy"
                        labelClassName="text-sm font-medium"
                        value={expiryDate}
                        disabled={disabled}
                        error={expiryError}
                        onChange={(date) => {
                            setValue("expiryMonth", date ? date.getMonth() + 1 : 0, { shouldValidate: true });
                            setValue("expiryYear", date?.getFullYear() ?? 0, { shouldValidate: true });
                        }}
                    />
                    <InputField
                        label="CVV"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        placeholder="Enter CVV"
                        labelClassName="text-sm font-medium"
                        disabled={disabled}
                        error={errors.cvv?.message}
                        {...register("cvv")}
                    />
                </FormGroup>

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
                <AppSection className="h-auto gap-2.5 rounded-[4px] bg-table-header-background">
                    <dl className="flex w-full flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-content-muted">Total charges</dt>
                            <dd>INR 650</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-content-muted">Apply offer</dt>
                            <dd>INR 65</dd>
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
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Enter here"
                                    disabled={disabled}
                                    containerClassName="h-[22px] rounded-[6px] border-content-muted px-2"
                                    className="text-xs placeholder:text-content-muted"
                                    error={errors.offerApplied?.message}
                                    {...register("offerApplied", {
                                        setValueAs: (value) => value === "" ? undefined : Number(value),
                                    })}
                                />
                            </dd>
                        </div>
                    </dl>
                    <Separator className="bg-primary/30" />
                    <dl className="flex w-full items-center justify-between gap-3 text-sm">
                        <dt className="text-content-muted">Total payment</dt>
                        <dd>INR {amount}</dd>
                    </dl>
                </AppSection>
            </FormGroup>
        </form>
    )
}
