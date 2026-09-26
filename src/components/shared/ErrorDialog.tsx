import InfoModal from "@/components/shared/InfoModal"

interface ErrorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    errors?: string[]
}

export default function ErrorDialog({
    open,
    onOpenChange,
    title = "Error",
    description,
    errors = [],
}: ErrorDialogProps) {
    return (
        <InfoModal
            variant="warning"
            showActions={false}
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={
                <div role="alert">
                    {description && <p className={errors.length > 0 ? "mb-2" : undefined}>{description}</p>}
                    {errors.length > 0 && (
                        <ul className="list-disc space-y-1 pl-5">
                            {errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
                        </ul>
                    )}
                </div>
            }
            contentClassName="md:w-[450px]"
            descriptionClassName="text-left leading-relaxed"
        />
    )
}
