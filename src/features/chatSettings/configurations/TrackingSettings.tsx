import { useId, useState } from "react";
import AppCard from "@/components/design/AppCard";
import Label from "@/components/design/Label";
import HelperText from "@/components/design/HelperText";
import SectionHeader from "@/components/shared/SectionHeader";

export default function TrackingSettings() {
    const id = useId();
    const [enabled, setEnabled] = useState(true);

    return (
        <SectionHeader heading="Tracking settings">
            <AppCard>
                <div className="flex items-start gap-2.5">
                    <input
                        id={id}
                        type="checkbox"
                        checked={enabled}
                        onChange={() => setEnabled((prev) => !prev)}
                        className="size-4 shrink-0 cursor-pointer rounded-[3px] border border-border-soft transition-colors checked:border-foreground checked:bg-foreground"
                    />

                    <div className="flex min-w-0 flex-col gap-1">
                        <Label htmlFor={id} className="cursor-pointer">
                            Enable UTM tracking
                        </Label>
                        <HelperText>
                            Add UTM parameters to links in chat responses, source
                            links, and follow-up campaigns
                        </HelperText>
                    </div>
                </div>
            </AppCard>
        </SectionHeader>
    );
}
