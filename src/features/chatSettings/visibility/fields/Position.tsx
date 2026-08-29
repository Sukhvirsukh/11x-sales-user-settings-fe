import { FieldGroup, Field } from "@/components/ui/field";
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
} from "@/pages/chatSettings/store/chatVisibility";

const POSITION_OPTIONS = [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
];

export default function Position() {
    const showOnMobile = useVisibilityStore((s) => s.fields.showOnMobile);
    const showOnDesktopTablet = useVisibilityStore((s) => s.fields.showOnDesktopTablet);
    const pageVisibility = useVisibilityStore((s) => s.fields.pageVisibility);
    const excludePages = useVisibilityStore((s) => s.fields.excludePages);
    const bubbleSize = useVisibilityStore((s) => s.fields.bubbleSize);
    const position = useVisibilityStore((s) => s.fields.position);
    const moveLeftRight = useVisibilityStore((s) => s.fields.moveLeftRight);
    const moveUpDown = useVisibilityStore((s) => s.fields.moveUpDown);
    const zIndex = useVisibilityStore((s) => s.fields.zIndex);
    const setField = useVisibilityStore((s) => s.setField);

    return (
        <CustomFormGroup gap="lg">
            <CustomFormGroup gap="md">
                <CustomLabel htmlFor="on-mobile">Show on your site</CustomLabel>
                <FieldGroup>
                    <Field orientation="horizontal" className="gap-2">
                        <Checkbox
                            id="on-mobile"
                            name="on-mobile"
                            checked={showOnMobile}
                            onCheckedChange={(checked) => setField("showOnMobile", checked === true)}
                        />
                        <CustomLabel
                            htmlFor="on-mobile"
                            className="font-normal text-muted-foreground"
                        >
                            On mobile
                        </CustomLabel>
                    </Field>
                    <Field orientation="horizontal" className="gap-2">
                        <Checkbox
                            id="desktop-tablet"
                            name="desktop-tablet"
                            checked={showOnDesktopTablet}
                            onCheckedChange={(checked) =>
                                setField("showOnDesktopTablet", checked === true)
                            }
                        />
                        <CustomLabel
                            htmlFor="desktop-tablet"
                            className="font-normal text-muted-foreground"
                        >
                            On Desktop & Tablet
                        </CustomLabel>
                    </Field>
                </FieldGroup>
            </CustomFormGroup>

            <CustomFormGroup gap="md">
                <CustomLabel htmlFor="page-visibility-all">Page visibility</CustomLabel>
                <RadioGroup
                    value={pageVisibility}
                    onValueChange={(value) => {
                        if (value === "all" || value === "specific") {
                            setField("pageVisibility", value as PageVisibilityMode);
                        }
                    }}
                >
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="all" id="page-visibility-all" />
                        <CustomLabel
                            className="font-normal text-muted-foreground"
                            htmlFor="page-visibility-all"
                        >
                            Show on all website page
                        </CustomLabel>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="specific" id="page-visibility-specific" />
                        <CustomLabel
                            className="font-normal text-muted-foreground"
                            htmlFor="page-visibility-specific"
                        >
                            Show on specific website page
                        </CustomLabel>
                    </div>
                </RadioGroup>
            </CustomFormGroup>

            <CustomFormGroup gap="lg">
                <CustomInput
                    label="Exclude some pages"
                    placeholder="Enter page URLs"
                    hint="Enter paths to hide the chat, such as /checkout"
                    value={excludePages}
                    onChange={(e) => setField("excludePages", e.target.value)}
                />

                <CustomInput
                    label="Bubble size"
                    placeholder="Enter bubble size"
                    value={bubbleSize}
                    onChange={(e) => setField("bubbleSize", e.target.value)}
                />

                <CustomSelect
                    label="Position"
                    options={POSITION_OPTIONS}
                    value={position}
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
                    value={moveLeftRight}
                    onValueChange={(value) => setField("moveLeftRight", value)}
                />

                <CustomSlider
                    label="Move up/down"
                    unit="px"
                    min={0}
                    max={200}
                    value={moveUpDown}
                    onValueChange={(value) => setField("moveUpDown", value)}
                />

                <CustomSlider
                    label="Z-index"
                    min={1}
                    max={9999}
                    value={zIndex}
                    onValueChange={(value) => setField("zIndex", value)}
                    hint="Higher values keep the bubble above other page elements"
                />
            </CustomFormGroup>
        </CustomFormGroup>
    );
}
