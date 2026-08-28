import CopyField from "@/components/shared/CopyField";
import { ChevronUp, QrCode } from "lucide-react";
import { useState } from "react";

export default function Channels() {
    const [open, setOpen] = useState(true);
    const chatLink = "<iframe=src'hhpss....=";
    const embedCode = "<iframe=src'hhpss....=";

    return (
        <div className="">
            {/* Channel row */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-900">
                        <span className="text-xs font-semibold text-white">V</span>
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Vita chat</p>
                        <p className="text-xs text-gray-500">
                            Talk to Vita lab directly on site
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors">
                        Visibility
                    </button>
                    <button className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Edit
                    </button>
                </div>
            </div>

            {/* Content grid */}
            <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] rounded-lg bg-white px-4 py-3   ">
                {/* Left column: links */}
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Link to chat
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Use the following link to the standalone chat page
                        </p>
                        <div className="relative mt-2">
                            <CopyField value={chatLink} />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Embedded chat (iframe)
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Add the following code into the HTML code of your page
                        </p>
                        <div className="relative mt-2">
                            <CopyField value={embedCode} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-200" />

                {/* Right column: QR code */}
                <div>
                    <p className="text-sm font-semibold text-gray-900">QR code</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Scanning this QR code will lead customers to a standalone
                        chat page
                    </p>
                    <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-white">
                        <QrCode className="h-16 w-16 text-gray-900" strokeWidth={1.2} />
                    </div>
                    <button className="mt-3 rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Download QR
                    </button>
                </div>
            </div>
        </div>
    );
}