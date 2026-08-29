import {
    CustomFormGroup,
    CustomInput,
    CustomColorSelector,
    CustomMultiTextField,
    CustomImageUploader,
} from "@/components/custom";
import { ChatBubbleTypeSelector } from "./ChatBubbleTypeSelector";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibility";

export default function LookNFeel() {
    const agentName = useVisibilityStore((s) => s.fields.agentName);
    const chatFace = useVisibilityStore((s) => s.fields.chatFace);
    const welcomeMessage = useVisibilityStore((s) => s.fields.welcomeMessage);
    const predefinedMessages = useVisibilityStore((s) => s.fields.predefinedMessages);
    const placeholderMessage = useVisibilityStore((s) => s.fields.placeholderMessage);
    const primaryColor = useVisibilityStore((s) => s.fields.primaryColor);
    const notificationColor = useVisibilityStore((s) => s.fields.notificationColor);
    const chatBubbleType = useVisibilityStore((s) => s.fields.chatBubbleType);
    const setField = useVisibilityStore((s) => s.setField);

    return (
        <CustomFormGroup>
            <CustomInput
                label="Name of AI Agent"
                placeholder="Enter name of AI agent"
                value={agentName}
                onChange={(e) => setField("agentName", e.target.value)}
            />

            <CustomImageUploader
                label="Chat face"
                note="Upload an image for the chat avatar. Accepted formats: PNG, JPG, JPEG, GIF, WEBP. Maximum file size: 50KB."
                accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
                maxSizeKB={50}
                value={chatFace}
                onValueChange={(file) => setField("chatFace", file)}
            />

            <CustomInput
                label="Welcome message"
                placeholder="Enter welcome message"
                value={welcomeMessage}
                onChange={(e) => setField("welcomeMessage", e.target.value)}
            />

            <CustomMultiTextField
                label="Pre-defined messages"
                hint="Add quick reply options that users can click"
                placeholder="Type a message and press Enter..."
                value={predefinedMessages}
                onValueChange={(tags) => setField("predefinedMessages", tags)}
            />

            <CustomInput
                label="Placeholder message"
                placeholder="Enter placeholder text"
                value={placeholderMessage}
                onChange={(e) => setField("placeholderMessage", e.target.value)}
            />

            <CustomColorSelector
                label="Primary color"
                hint="Choose the primary color for the chat widget"
                value={primaryColor}
                onValueChange={(color) => setField("primaryColor", color)}
                showPresets={false}
            />

            <CustomColorSelector
                label="Notification color"
                hint="Choose the color for notification badges"
                value={notificationColor}
                onValueChange={(color) => setField("notificationColor", color)}
                showPresets={false}
            />

            <ChatBubbleTypeSelector
                value={chatBubbleType}
                onValueChange={(type) => setField("chatBubbleType", type)}
            />
        </CustomFormGroup>
    );
}
