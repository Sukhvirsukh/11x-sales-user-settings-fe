import Modal from "@/components/design/Modal";
import { InputField } from "@/components/design/InputField";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SquarePen } from "lucide-react";
import { FormGroup } from "@/components/design/FormGroup";
import Label from "@/components/design/Label";
import { useState } from "react";

export default function BasicDetailsForm() {
    const [points, setPoints] = useState([50]);

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
                />
                <InputField
                    label="Email"
                    placeholder="Enter email"
                    labelClassName="text-sm font-medium"
                />
                <InputField
                    label="Phone"
                    placeholder="Enter phone number"
                    type="number"
                    labelClassName="text-sm font-medium"
                />
                <div className="flex flex-col gap-2">
                    <Label className="text-sm">Points used</Label>
                    <Slider
                        value={points}
                        min={0}
                        max={100}
                        disabled
                    />
                    <span className="text-sm text-ghost">{points} / 100 used</span>
                </div>
            </FormGroup>
        </Modal>
    )
}
