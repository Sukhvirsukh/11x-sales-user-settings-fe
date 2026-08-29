import CrawlSettings from "@/features/chatSettings/CrawlSettings";
import Span from "@/features/chatSettings/Span";
import TrackingSettings from "@/features/chatSettings/TrackingSettings";

export default function Configurations() {


    return (
        <div className="w-full min-w-0 font-sans text-body text-foreground">

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