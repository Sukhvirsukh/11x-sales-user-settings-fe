import { useFormContext } from "react-hook-form";
import AppCard from "@/components/design/AppCard";
import { InputField } from "@/components/design/InputField";
import SectionHeader from "@/components/shared/SectionHeader";
import { FormGroup } from "@/components/design/FormGroup";
import type { ConfigurationFormValues } from "./Configurations";
import { SelectField } from "@/components/design/SelectField";
import { useIntervalsQuery } from "../chatSettingsQuery";

export default function SpamFilter() {
    const { register, setValue, watch } = useFormContext<ConfigurationFormValues>();
    const { data, isLoading } = useIntervalsQuery();

    return (
        <SectionHeader heading="Spam filter">
            <AppCard>
                <FormGroup gap="lg" col={3}>
                    <InputField
                        label="Rate limit (Max replies of user)"
                        placeholder="Enter"
                        type="number"
                        hint="Limit the number of messages a user can send during a period time"
                        {...register("rateLimit")}
                    />

                    <SelectField
                        label="Over a period of"
                        disabled={isLoading}
                        options={data || [{ label: "One hour", value: "ONE_HOUR" }]}
                        value={watch("crawlInterval")}
                        onValueChange={(value) => {
                            if (value) setValue("crawlInterval", value, { shouldDirty: true });
                        }}
                    />

                    <InputField
                        label="Message when limit is reached"
                        placeholder="Enter"
                        {...register("messageWhenLimitReached")}
                    />
                </FormGroup>
            </AppCard>
        </SectionHeader>
    );
}
