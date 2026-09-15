import { useState } from "react";
import AppCard from "@/components/design/AppCard";
import { InputField } from "@/components/design/InputField";
import SectionHeader from "@/components/shared/SectionHeader";
import { FormGroup } from "@/components/design/FormGroup";

export default function SpamFilter() {
    const [rateLimit, setRateLimit] = useState("");
    const [period, setPeriod] = useState("");
    const [limitMessage, setLimitMessage] = useState("");

    return (
        <SectionHeader heading="Spam filter">
            <AppCard>
                <FormGroup gap="lg" col={3}>
                    <InputField
                        label="Rate limit (Max replies of user)"
                        placeholder="Enter"
                        hint="Limit the number of messages a user can send during a period time"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(e.target.value)}
                    />

                    <InputField
                        label="Over a period of"
                        placeholder="Enter"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    />

                    <InputField
                        label="Message when limit is reached"
                        placeholder="Enter"
                        value={limitMessage}
                        onChange={(e) => setLimitMessage(e.target.value)}
                    />
                </FormGroup>
            </AppCard>
        </SectionHeader>
    );
}
