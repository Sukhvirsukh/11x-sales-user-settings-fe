import { useId, useState, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import Heading from "@/components/design/Heading"

/** Divider-topped section whose heading toggles its body, chevron pointing down when open. */
export function CollapsibleSection({ title, contentClassName, children }: {
    title: string
    contentClassName?: string
    children: ReactNode
}) {
    const [isOpen, setIsOpen] = useState(true)
    const contentId = useId()

    return (
        <div className="border-t border-section-border pt-4">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="flex w-full cursor-pointer items-center justify-between gap-2 text-left"
            >
                <Heading size="md" className="font-semibold">{title}</Heading>
                <ChevronRight
                    aria-hidden
                    className={`size-4 shrink-0 text-content-muted transition-transform${isOpen ? " rotate-90" : ""}`}
                />
            </button>
            <div id={contentId} hidden={!isOpen} className={contentClassName}>
                {children}
            </div>
        </div>
    )
}
