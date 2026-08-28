import CrawlSettings from "@/features/chatSettings/CrawlSettings";
import Span from "@/features/chatSettings/Span";
import TrackingSettings from "@/features/chatSettings/TrackingSettings";

export default function Configurations() {


    return (
        <div className="w-full text-slate-800 font-sans text-sm">

            {/* ---------------- Crawl Settings ---------------- */}
            <CrawlSettings />

            {/* ---------------- Tracking Settings ---------------- */}
            <div className="pt-2">
                <TrackingSettings />
            </div>

            {/* ---------------- Spam Filter ---------------- */}
            <div className="pt-2">
                <Span />
            </div>

        </div>
    );
}