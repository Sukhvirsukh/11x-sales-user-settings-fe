import { useState } from 'react';
import CustomSection from './CustomSection'

export default function TrackingSettings() {

    // State for UTM tracking checkbox
    const [enableUtm, setEnableUtm] = useState(true);

    return (
        <CustomSection heading="Tracking Settings">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <input
                    type="checkbox"
                    checked={enableUtm}
                    onChange={(e) => setEnableUtm(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer accent-slate-900"
                />
                <span className="font-semibold text-slate-900 text-sm">Enable UTM tracking</span>
            </label>
            <p className="text-xs text-slate-400 pl-7">
                Add UTM parameters to links in chat responses, source links, and follow-up campaigns
            </p>
        </CustomSection>
    )
}
