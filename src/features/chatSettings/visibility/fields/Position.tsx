import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CustomFormGroup,
  CustomInput,
  CustomLabel,
  CustomSelect,
  CustomSlider,
} from "@/components/custom";
import {
  useVisibilityStore,
  type BubblePosition,
  type PageVisibilityMode,
} from "@/pages/chatSettings/store/chatVisibilityStore";

const POSITION_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export default function Position() {
  const fields = useVisibilityStore((s) => s.fields);
  const setField = useVisibilityStore((s) => s.setField);

  return (
    <CustomFormGroup>
      {/* Show on your site */}
      <CustomFormGroup gap="sm">
        <CustomLabel>Show on your site</CustomLabel>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={fields.showOnMobile}
              onCheckedChange={(checked) =>
                setField("showOnMobile", checked === true)
              }
            />
            <span className="text-body-sm text-muted-foreground">
              On mobile
            </span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={fields.showOnDesktopTablet}
              onCheckedChange={(checked) =>
                setField("showOnDesktopTablet", checked === true)
              }
            />
            <span className="text-body-sm text-muted-foreground">
              On Desktop & Tablet
            </span>
          </label>
        </div>
      </CustomFormGroup>

      {/* Page visibility */}
      <CustomFormGroup gap="sm">
        <CustomLabel>Page visibility</CustomLabel>
        <RadioGroup
          value={fields.pageVisibility}
          onValueChange={(value) => {
            if (value === "all" || value === "specific") {
              setField("pageVisibility", value as PageVisibilityMode);
            }
          }}
        >
          <label className="flex items-center gap-3">
            <RadioGroupItem value="all" />
            <span className="text-body-sm text-muted-foreground">
              Show on all website page
            </span>
          </label>
          <label className="flex items-center gap-3">
            <RadioGroupItem value="specific" />
            <span className="text-body-sm text-muted-foreground">
              Show on specific website page
            </span>
          </label>
        </RadioGroup>
      </CustomFormGroup>

      <CustomInput
        label="Exclude some pages"
        placeholder="Enter page URLs"
        hint="Enter paths to hide the chat, such as /checkout"
        value={fields.excludePages}
        onChange={(e) => setField("excludePages", e.target.value)}
      />

      <CustomSlider
        label="Bubble size"
        unit="px"
        min={24}
        max={120}
        value={Number(fields.bubbleSize) || 56}
        onValueChange={(value) => setField("bubbleSize", String(value))}
      />

      <CustomSelect
        label="Position"
        options={POSITION_OPTIONS}
        value={fields.position}
        onValueChange={(value) => {
          if (value === "left" || value === "right") {
            setField("position", value as BubblePosition);
          }
        }}
      />

      <CustomSlider
        label="Move left, right"
        unit="px"
        min={0}
        max={200}
        value={fields.moveLeftRight}
        onValueChange={(value) => setField("moveLeftRight", value)}
      />

      <CustomSlider
        label="Move up/down"
        unit="px"
        min={0}
        max={200}
        value={fields.moveUpDown}
        onValueChange={(value) => setField("moveUpDown", value)}
      />

      <CustomSlider
        label="Z-index"
        min={1}
        max={9999}
        value={fields.zIndex}
        onValueChange={(value) => setField("zIndex", value)}
        hint="Higher values keep the bubble above other page elements"
      />
    </CustomFormGroup>
  );
}
