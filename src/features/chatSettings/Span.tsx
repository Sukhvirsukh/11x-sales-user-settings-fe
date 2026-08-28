import CustomSection from "./CustomSection";

export default function Span() {
    return (
        <CustomSection heading="Span">
            {/* Rate limit */}
            <div className="space-y-2">
                <div className="space-y-1.5">
                    <label className="block text-sm">
                        Rate limit (Max replies of user)
                    </label>
                    <input
                        type="text"
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm text-slate-800"
                    />
                    <p className="text-xs text-slate-400">
                        Limit the number of messages a user can send during a period time
                    </p>
                </div>

                {/* Over a period of */}
                <div className="space-y-1.5">
                    <label className="block text-sm">
                        Over a period of
                    </label>
                    <input
                        type="text"
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm text-slate-800"
                    />
                </div>

                {/* Message when limit is reached */}
                <div className="space-y-1.5">
                    <label className="block text-sm">
                        Message when limit is reached
                    </label>
                    <input
                        type="text"
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm text-slate-800"
                    />
                </div>
            </div>
        </CustomSection>
    )
}
