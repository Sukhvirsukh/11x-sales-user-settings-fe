import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { SelectField } from "@/components/design/SelectField";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddRoleForm() {
    return (
        <Modal
            trigger={
                <Button variant="primary" size="sm" className="">
                    Add role
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
                    label="Name"
                    placeholder="Enter name"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />
                <InputField
                    label="Email"
                    placeholder="Enter email"
                    labelClassName="text-sm font-medium"
                    variant="light"
                />
                <SelectField
                    label="Role"
                    placeholder="Select role"
                    options={[
                        { value: "admin", label: "Admin" },
                        { value: "manager", label: "Manager" },
                        { value: "user", label: "User" },
                        { value: "member", label: "Member" },
                    ]}
                    variant="light"
                />
                <DatePicker label="Joining date" placeholder="Pick a date" labelClassName="text-sm font-medium" variant="light" />

            </FormGroup>
        </Modal>
    )
}
