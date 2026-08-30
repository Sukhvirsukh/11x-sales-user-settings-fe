import {
  CustomFormGroup,
  CustomInput,
  CustomColorSelector,
  CustomMultiTextField,
  CustomImageUploader,
} from "@/components/custom";
import { ChatBubbleTypeSelector } from "./ChatBubbleTypeSelector";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibilityStore";

export default function LookNFeel() {
  const fields = useVisibilityStore((s) => s.fields);
  const setField = useVisibilityStore((s) => s.setField);

  return (
    <CustomFormGroup>
      <CustomInput
        label="Name of AI Agent"
        placeholder="Enter name of AI agent"
        value={fields.agentName}
        onChange={(e) => setField("agentName", e.target.value)}
      />

      <CustomImageUploader
        label="Chat face"
        note="Upload an image for the chat avatar. Accepted formats: PNG, JPG, JPEG, GIF, WEBP. Maximum file size: 50KB."
        accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
        maxSizeKB={50}
        value={fields.chatFace}
        onValueChange={(file) => setField("chatFace", file)}
      />

      <CustomInput
        label="Welcome message"
        placeholder="Enter welcome message"
        value={fields.welcomeMessage}
        onChange={(e) => setField("welcomeMessage", e.target.value)}
      />

      <CustomMultiTextField
        label="Pre-defined messages"
        hint="Add quick reply options that users can click"
        placeholder="Type a message and press Enter..."
        value={fields.predefinedMessages}
        onValueChange={(tags) => setField("predefinedMessages", tags)}
      />

      <CustomInput
        label="Placeholder message"
        placeholder="Enter placeholder text"
        value={fields.placeholderMessage}
        onChange={(e) => setField("placeholderMessage", e.target.value)}
      />

      <CustomColorSelector
        label="Primary color"
        hint="Choose the primary color for the chat widget"
        value={fields.primaryColor}
        onValueChange={(color) => setField("primaryColor", color)}
        showPresets={false}
      />

      <CustomColorSelector
        label="Notification color"
        hint="Choose the color for notification badges"
        value={fields.notificationColor}
        onValueChange={(color) => setField("notificationColor", color)}
        showPresets={false}
      />

      <ChatBubbleTypeSelector
        value={fields.chatBubbleType}
        onValueChange={(type) => setField("chatBubbleType", type)}
      />
    </CustomFormGroup>
  );
}
