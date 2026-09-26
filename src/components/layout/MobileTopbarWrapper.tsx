import { ChatBox } from "@/components/shared/chatBox";
import { useTestChatStore } from "@/stores/testChatStore";
import MobileTopbar from "./MobileTopbar";
import MobileSidebar from "./sidebar/MobileSidebar";

export default function MobileTopbarWrapper() {
    const isChatOpen = useTestChatStore((state) => state.isOpen);
    const closeChat = useTestChatStore((state) => state.close);

    return (
        <>
            <MobileTopbar />
            <MobileSidebar />

            {isChatOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close test chat"
                        className="fixed inset-0 z-40 bg-content-strong/40 backdrop-blur-xs md:hidden"
                        onClick={closeChat}
                    />

                    <div className="fixed inset-x-3 bottom-3 top-3 z-50 rounded-[10px] border border-border bg-card shadow-lg max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[80dvh] max-sm:max-h-[calc(100dvh-1rem)] max-sm:animate-in max-sm:slide-in-from-bottom max-sm:rounded-b-none max-sm:border-0 max-sm:bg-transparent max-sm:duration-300 motion-reduce:animate-none md:hidden">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-0 z-[-1] hidden h-20 w-[90%] -translate-x-1/2 rounded-t-[20px] bg-primary max-sm:block"
                        />

                        <div className="h-full min-h-0 max-sm:mt-2 max-sm:overflow-hidden max-sm:rounded-t-[10px] max-sm:bg-popover">
                            <ChatBox
                                onClose={closeChat}
                                className="h-full max-sm:rounded-b-none"
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
