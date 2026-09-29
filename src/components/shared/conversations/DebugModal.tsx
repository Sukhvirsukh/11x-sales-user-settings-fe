import { CustomTabs } from "@/components/design/CustomTabs";
import Modal from "@/components/design/Modal";
import { TextAreaField } from "@/components/design/TextAreaField";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const tabs = [
    { id: "ai-helper", label: "Ai helper" },
    { id: "raw-debug", label: "RAW debug" }
]

function AiHelper() {
    return (
        <TextAreaField
            aria-label="ai-helper"
            placeholder="Enter here"
            rows={4}
            label="What's wrong with this message?"
            labelClassName="text-sm font-medium"
        // value={note}
        // onChange={(event) => setNote(event.target.value)}
        />

    )
}

function RawDebug() {
    const value = "// ESMimport { Log, logger } from 'debug-level'// Commonjsconst { Log, logger } = require('debug-level')// creates a logger for <namespace> `test`const log = new Log('test')// or using a global Log instanceconst log = logger('test')log.fatal(new Error('fatal'))        // logs an Error at level FATALlog.error(new Error('boom'))         // logs an Error at level ERRORlog.warn('huh %o', {ghost: 'rider'}) // logs a formatted object at level WARNlog.info('%s world', 'hello')        // logs a formatted string at level INFOlog.debug({object: 1})               // logs an object at level DEBUGlog.trace('hi')                      // logs a string at level TRACElog.log('always logs')               // always logs regardless of set level"
    return (
        <TextAreaField
            aria-label="raw-debug"
            placeholder="Enter here"
            rows={4}
            disabled
            value={value}
        // onChange={(event) => setNote(event.target.value)}
        />

    )
}

export default function DebugModal() {

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    function handleTabChange(tabId: string) {
        const tab = tabs.find((item) => item.id === tabId);
        if (tab) setActiveTab(tab.id);
    }

    return (
        <Modal
            title="Add note"
            trigger={
                <Button variant="bare" size="sm" className='text-content-strong font-normal transition-colors hover:text-primary'>
                    Debug
                </Button>
            }
            primaryAction={{ label: "Save" }}
            closeAction={{ label: "Cancel" }}
        >
            <CustomTabs
                tabs={tabs.map(({ id, label }) => ({ id, label }))}
                value={activeTab}
                onValueChange={handleTabChange}
            >
                {
                    activeTab === "ai-helper" ? <AiHelper /> : <RawDebug />
                }

            </CustomTabs>
        </Modal>
    )
}
