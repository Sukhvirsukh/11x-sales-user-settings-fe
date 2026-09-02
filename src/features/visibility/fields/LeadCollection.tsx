import { InputField } from "@/components/design/InputField";
import { FormGroup } from "@/components/design/FormGroup";
import { GroupRadioField } from "@/components/design/GroupRadioField";
import {
  useVisibilityStore,
  type LeadStatus,
  type MarketingConsent,
  type ConsentCheckboxDefault,
} from "@/components/shared/chatBox/store/chatVisibilityStore";

export default function LeadCollection() {
  const fields = useVisibilityStore((s) => s.fields);
  const setField = useVisibilityStore((s) => s.setField);

  return (
    <FormGroup>
      <GroupRadioField
        label="Lead collection status"
        value={fields.leadStatus}
        onValueChange={(value) => {
          if (value === "ask-email" || value === "dont-ask") {
            setField("leadStatus", value as LeadStatus);
          }
        }}
        options={[
          { value: "ask-email", label: "Ask for email before starting a chat" },
          { value: "dont-ask", label: "Don't ask for email" },
        ]}
      />

      <InputField
        label="Title"
        placeholder="Enter title"
        value={fields.leadTitle}
        onChange={(e) => setField("leadTitle", e.target.value)}
      />

      <InputField
        label="Subtitle(Optional)"
        placeholder="Enter subtitle"
        value={fields.leadSubtitle}
        onChange={(e) => setField("leadSubtitle", e.target.value)}
      />

      <InputField
        label='"Send" button label'
        placeholder="Enter button label"
        hint="Ask for email before starting a chat"
        value={fields.sendButtonLabel}
        onChange={(e) => setField("sendButtonLabel", e.target.value)}
      />

      <InputField
        label="Email field placeholder"
        placeholder="Enter email placeholder"
        hint="Ask for email before starting a chat"
        value={fields.emailPlaceholder}
        onChange={(e) => setField("emailPlaceholder", e.target.value)}
      />

      <GroupRadioField
        label="Marketing consent"
        value={fields.marketingConsent}
        onValueChange={(value) => {
          if (value === "ask-marketing" || value === "dont-ask-marketing") {
            setField("marketingConsent", value as MarketingConsent);
          }
        }}
        options={[
          { value: "ask-marketing", label: "Ask for marketing consent" },
          { value: "dont-ask-marketing", label: "Don't ask for marketing consent" },
        ]}
      />

      <GroupRadioField
        label="Marketing consent checkbox default"
        value={fields.consentCheckboxDefault}
        onValueChange={(value) => {
          if (value === "pre-selected" || value === "not-selected") {
            setField("consentCheckboxDefault", value as ConsentCheckboxDefault);
          }
        }}
        options={[
          { value: "pre-selected", label: "Pre-selected" },
          { value: "not-selected", label: "Not selected" },
        ]}
      />

      <InputField
        label="Marketing consent text"
        placeholder="Enter marketing consent text"
        hint="*text that ask for marketing consent"
        value={fields.marketingConsentText}
        onChange={(e) => setField("marketingConsentText", e.target.value)}
      />
    </FormGroup>
  );
}
