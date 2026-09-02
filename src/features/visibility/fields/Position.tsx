import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { SliderField } from "@/components/design/SliderField";
import { SelectField } from "@/components/design/SelectField";
import { GroupRadioField } from "@/components/design/GroupRadioField";
import { GroupCheckboxField } from "@/components/design/GroupCheckboxField";
import {
  useVisibilityStore,
  type BubblePosition,
  type PageVisibilityMode,
} from "@/components/shared/chatBox/store/chatVisibilityStore";

const POSITION_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export default function Position() {
  const fields = useVisibilityStore((s) => s.fields);
  const setField = useVisibilityStore((s) => s.setField);

  return (
    <FormGroup>
      <GroupCheckboxField
        label="Show on your site"
        value={[
          ...(fields.showOnMobile ? ["mobile"] : []),
          ...(fields.showOnDesktopTablet ? ["desktop"] : []),
        ]}
        onValueChange={(values) => {
          setField("showOnMobile", values.includes("mobile"));
          setField("showOnDesktopTablet", values.includes("desktop"));
        }}
        options={[
          { value: "mobile", label: "On mobile" },
          { value: "desktop", label: "On Desktop & Tablet" },
        ]}
      />

      <GroupRadioField
        label="Page visibility"
        value={fields.pageVisibility}
        onValueChange={(value) => {
          if (value === "all" || value === "specific") {
            setField("pageVisibility", value as PageVisibilityMode);
          }
        }}
        options={[
          { value: "all", label: "Show on all website page" },
          { value: "specific", label: "Show on specific website page" },
        ]}
      />

      <InputField
        label="Exclude some pages"
        placeholder="Enter page URLs"
        hint="Enter paths to hide the chat, such as /checkout"
        value={fields.excludePages}
        onChange={(e) => setField("excludePages", e.target.value)}
      />

      <SliderField
        label="Bubble size"
        unit="px"
        min={24}
        max={120}
        value={Number(fields.bubbleSize) || 56}
        onValueChange={(value) => setField("bubbleSize", String(value))}
      />

      <SelectField
        label="Position"
        options={POSITION_OPTIONS}
        value={fields.position}
        onValueChange={(value) => {
          if (value === "left" || value === "right") {
            setField("position", value as BubblePosition);
          }
        }}
      />

      <SliderField
        label="Move left, right"
        unit="px"
        min={0}
        max={200}
        value={fields.moveLeftRight}
        onValueChange={(value) => setField("moveLeftRight", value)}
      />

      <SliderField
        label="Move up/down"
        unit="px"
        min={0}
        max={200}
        value={fields.moveUpDown}
        onValueChange={(value) => setField("moveUpDown", value)}
      />

      <SliderField
        label="Z-index"
        min={1}
        max={9999}
        value={fields.zIndex}
        onValueChange={(value) => setField("zIndex", value)}
        hint="Higher values keep the bubble above other page elements"
      />
    </FormGroup>
  );
}
