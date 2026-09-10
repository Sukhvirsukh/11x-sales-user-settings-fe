import { useState } from "react";
import { useForm } from "react-hook-form";
import { SquarePen } from "lucide-react";
import Modal from "@/components/design/Modal";
import { useMutation } from "@tanstack/react-query";

import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { FormGroup } from "@/components/design/FormGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/features/auth";
import { basicDetailsSchema } from "./basicDetailsSchema";
import type { BasicDetailsFormValues } from "./basicDetailsTypes";
import { updateProfile } from "./basicDetailsApi";

export default function BasicDetailsForm() {
    const user = useAuthStore(data => data.user);
    const setUser = useAuthStore(data => data.setUser);
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BasicDetailsFormValues>({
        resolver: zodResolver(basicDetailsSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            setUser({
                id: updatedUser.id ?? user?.id,
                name: updatedUser.name,
                email: updatedUser.email ?? user?.email,
                phone: updatedUser.phone ?? user?.phone,
                role: updatedUser.role ?? user?.role,
            });
            setIsOpen(false);
        },
    });

    function saveBasicDetails(values: BasicDetailsFormValues) {
        updateProfileMutation.mutate(values);
    }

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
        if (open) {
            reset({
                name: user?.name ?? "",
                email: user?.email ?? "",
                phone: user?.phone ?? "",
            });
        }
    }

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
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
                disabled: updateProfileMutation.isPending,
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
                </FormGroup>
            </form>
        </Modal>
    )
}
