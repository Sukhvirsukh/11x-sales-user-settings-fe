import Modal from "@/components/design/Modal";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SquarePen } from "lucide-react";
import { FormGroup } from "@/components/design/FormGroup";
import Label from "@/components/design/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/features/auth";
import { basicDetailsSchema } from "./basicDetailsSchema";
import type { BasicDetailsFormValues } from "./basicDetailsTypes";

export default function BasicDetailsForm() {
    const user = useAuthStore(data => data.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BasicDetailsFormValues>({
        resolver: zodResolver(basicDetailsSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
        },
    });

    function saveBasicDetails(values: BasicDetailsFormValues) {
        console.log("Save", values);
    }

    return (
        <Modal
            trigger={
                /* Mobile: icon-only button next to the avatar.
                   Desktop: full "Edit details" button. */
                <Button
                    variant="ghost"
                    size="default"
                    className="px-2.5 py-1.5 sm:px-[10px] sm:py-[10px] text-md"
                >
                    <span className="hidden sm:inline">Edit details</span>
                    <SquarePen size={14} className="ml-1" />
                </Button>
            }
            title="Edit details"
            primaryAction={{
                label: "Save",
                onClick: handleSubmit(saveBasicDetails),
            }}
            closeAction={{
                label: "Cancel",
            }}
        >
            <form onSubmit={handleSubmit(saveBasicDetails)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        labelClassName="text-sm font-medium"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        labelClassName="text-sm font-medium"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <InputField
                        label="Phone"
                        placeholder="Enter phone number"
                        type="number"
                        labelClassName="text-sm font-medium"
                        error={errors.phone?.message}
                        {...register("phone")}
                    />
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm">Points used</Label>
                        <Slider
                            value={[50]}
                            min={0}
                            max={100}
                            disabled
                        />
                        <span className="text-sm text-ghost">50 / 100 used</span>
                    </div>
                </FormGroup>
            </form>
        </Modal>
    )
}
