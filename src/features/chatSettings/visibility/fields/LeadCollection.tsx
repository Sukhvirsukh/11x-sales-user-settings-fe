import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CustomFormGroup,
  CustomInput,
  CustomLabel,
} from "@/components/custom";
import {
  useVisibilityStore,
  type ConsentCheckboxDefault,
  type LeadStatus,
  type MarketingConsent,
} from "@/pages/chatSettings/store/chatVisibilityStore";

export default function LeadCollection() {
  const fields = useVisibilityStore((s) => s.fields);
  const setField = useVisibilityStore((s) => s.setField);

  return (
    <CustomFormGroup gap="lg">
      <CustomFormGroup gap="md">
        <CustomLabel htmlFor="lead-status">Lead collection status</CustomLabel>
        <RadioGroup
          value={fields.leadStatus}
          onValueChange={(value) => {
            if (value === "ask-email" || value === "dont-ask") {
              setField("leadStatus", value as LeadStatus);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="ask-email" id="lead-status" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="lead-status"
            >
              Ask for email before starting a chat
            </CustomLabel>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="dont-ask" id="lead-status-dont" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="lead-status-dont"
            >
              Don't ask for email
            </CustomLabel>
          </div>
        </RadioGroup>
      </CustomFormGroup>

      <CustomInput
        label="Title"
        placeholder="Enter title"
        value={fields.leadTitle}
        onChange={(e) => setField("leadTitle", e.target.value)}
      />

      <CustomInput
        label="Subtitle(Optional)"
        placeholder="Enter subtitle"
        value={fields.leadSubtitle}
        onChange={(e) => setField("leadSubtitle", e.target.value)}
      />

      <CustomInput
        label='"Send" button label'
        placeholder="Enter button label"
        hint="Ask for email before starting a chat"
        value={fields.sendButtonLabel}
        onChange={(e) => setField("sendButtonLabel", e.target.value)}
      />

      <CustomInput
        label="Email field placeholder"
        placeholder="Enter email placeholder"
        hint="Ask for email before starting a chat"
        value={fields.emailPlaceholder}
        onChange={(e) => setField("emailPlaceholder", e.target.value)}
      />

      <CustomFormGroup gap="md">
        <CustomLabel htmlFor="marketing-consent">Marketing consent</CustomLabel>
        <RadioGroup
          value={fields.marketingConsent}
          onValueChange={(value) => {
            if (value === "ask-marketing" || value === "dont-ask-marketing") {
              setField("marketingConsent", value as MarketingConsent);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="ask-marketing" id="marketing-consent" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="marketing-consent"
            >
              Ask for marketing consent
            </CustomLabel>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="dont-ask-marketing" id="marketing-consent-dont" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="marketing-consent-dont"
            >
              Don't ask for marketing consent
            </CustomLabel>
          </div>
        </RadioGroup>
      </CustomFormGroup>

      <CustomFormGroup gap="md">
        <CustomLabel htmlFor="consent-checkbox-default">
          Marketing consent checkbox default
        </CustomLabel>
        <RadioGroup
          value={fields.consentCheckboxDefault}
          onValueChange={(value) => {
            if (value === "pre-selected" || value === "not-selected") {
              setField("consentCheckboxDefault", value as ConsentCheckboxDefault);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="pre-selected" id="consent-checkbox-default" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="consent-checkbox-default"
            >
              Pre-selected
            </CustomLabel>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="not-selected" id="consent-checkbox-default-not" />
            <CustomLabel
              className="font-normal text-muted-foreground"
              htmlFor="consent-checkbox-default-not"
            >
              Not selected
            </CustomLabel>
          </div>
        </RadioGroup>
      </CustomFormGroup>

      <CustomInput
        label="Marketing consent text"
        placeholder="Enter marketing consent text"
        hint="*text that ask for marketing consent"
        value={fields.marketingConsentText}
        onChange={(e) => setField("marketingConsentText", e.target.value)}
      />
    </CustomFormGroup>
  );
}
