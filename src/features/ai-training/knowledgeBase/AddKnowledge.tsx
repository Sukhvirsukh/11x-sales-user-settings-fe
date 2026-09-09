import Modal from "@/components/design/Modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddKnowledge() {
    return (
        <Modal
            trigger={
                <Button variant="primary" size="sm" className="">
                    Add knowledge
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
            dfkdkjk
        </Modal>
    )
}
