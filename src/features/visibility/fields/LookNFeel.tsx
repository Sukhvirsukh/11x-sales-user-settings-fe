import { useState } from "react";
import { z } from "zod";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import ImageUploader from "@/components/design/ImageUploader";
import { MultiTextField } from "@/components/design/MultiTextField";
import { ColorSelector } from "@/components/design/ColorSelector";
import { ChatBubbleTypeSelector } from "@/components/design/ChatBubbleTypeSelector";
import { TextAreaField } from "@/components/design/TextAreaField";
import { useVisibilityForm } from "../VisibilityFormContext";
import { requiredFieldsSchema } from "./validations";


type RequiredField = keyof z.infer<typeof requiredFieldsSchema>;

export default function LookNFeel() {
  const { fields, setField } = useVisibilityForm();
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});

  function updateRequiredField(key: RequiredField, value: string) {
    const result = requiredFieldsSchema.shape[key].safeParse(value);
    setErrors((current) => ({
      ...current,
      [key]: result.success ? undefined : result.error.issues[0]?.message,
    }));
    setField(key, value);
  }

  return (
    <FormGroup>
      <InputField
        label="Name of AI Agent"
        placeholder="Enter name of AI agent"
        value={fields.agentName}
        error={errors.agentName}
        onChange={(e) => updateRequiredField("agentName", e.target.value)}
      />

      <ImageUploader
        // label="Chat face"
        note="Upload an image for the chat avatar. Accepted formats: PNG, JPG, JPEG, GIF, WEBP. Maximum file size: 50KB."
        accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
        maxSizeKB={50}
        value={fields.chatFace}
        onValueChange={(file) => setField("chatFace", file)}
      />

      <InputField
        label="Welcome message"
        placeholder="Enter welcome message"
        value={fields.welcomeMessage}
        error={errors.welcomeMessage}
        onChange={(e) => updateRequiredField("welcomeMessage", e.target.value)}
      />

      <MultiTextField
        label="Pre-defined messages"
        hint="Add quick reply options that users can click"
        placeholder="Type a message and press Enter..."
        value={fields.predefinedMessages}
        onValueChange={(tags) => setField("predefinedMessages", tags)}
      />

      <InputField
        label="Placeholder message"
        placeholder="Enter placeholder text"
        value={fields.placeholderMessage}
        error={errors.placeholderMessage}
        onChange={(e) => updateRequiredField("placeholderMessage", e.target.value)}
      />

      <ColorSelector label="Primary color" hint="Choose the primary color for the chat widget" value={fields.primaryColor} error={errors.primaryColor} onValueChange={(color) => updateRequiredField("primaryColor", color)} showPresets={false} />

      <ColorSelector label="Notification color" hint="Choose the color for notification badges" value={fields.notificationColor} error={errors.notificationColor} onValueChange={(color) => updateRequiredField("notificationColor", color)} showPresets={false} />

      <TextAreaField
        label="Desclaimer message"
        placeholder="Enter desclaimer message"
      />


      <ChatBubbleTypeSelector
        value={fields.chatBubbleType}
        onValueChange={(type) => setField("chatBubbleType", type)}
      />
    </FormGroup>
  );
}
