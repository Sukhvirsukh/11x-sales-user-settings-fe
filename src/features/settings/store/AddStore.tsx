import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddStore() {
    return (
        <Modal
            trigger={
                <Button variant="primary" size="sm" className="">
                    Add store
                    <Plus className="md:ml-2 ml-0.5 md:size-4 size-2" />
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
            <FormGroup gap="sm">
                <InputField
                    label="Store Name"
                    placeholder="Enter store name"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />
                <InputField
                    label="Store URL"
                    placeholder="Enter store URL"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />

                <InputField
                    label="Store owner"
                    placeholder="Enter store owner"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />

                <InputField
                    label="Store owner"
                    placeholder="Enter store owner"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />

                <DatePicker
                    label="Start date"
                    placeholder="Pick a date"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />


            </FormGroup>
        </Modal>
    )
}
