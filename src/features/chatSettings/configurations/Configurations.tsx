import CrawlSettings from "./CrawlSettings";
import TrackingSettings from "./TrackingSettings";
import SpamFilter from "./SpamFilter";

export default function Configurations() {
    return (
        <div className="flex min-w-0 flex-col gap-3.5">
            <CrawlSettings />
            <TrackingSettings />
            <SpamFilter />
        </div>
    );
}
