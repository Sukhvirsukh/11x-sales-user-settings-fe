import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, Upload, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/ui/field";
import Label from "./Label";
import HelperText from "./HelperText";

interface CustomImageUploaderProps {
    label?: string;
    hint?: string;
    note?: string;
    value?: string | File | null;
    onValueChange?: (file: File | null) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    accept?: string[];
    /** Maximum file size in KB. */
    fileSize?: number;
    maxSizeKB?: number;
    variant?: "default" | "light";
}

const IMAGE_ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
export const DOCUMENT_ACCEPT = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FILE_TYPE_LABELS: Record<string, string> = {
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

export default function ImageUploader({
    label,
    hint,
    note,
    value: controlledValue,
    onValueChange,
    id,
    disabled = false,
    className,
    accept = IMAGE_ACCEPT,
    fileSize,
    maxSizeKB,
    variant = "default",
}: CustomImageUploaderProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageValue = controlledValue ?? uncontrolledValue;
    const imageUrl = imageValue instanceof File ? URL.createObjectURL(imageValue) : imageValue;
    const setImage = (file: File | null) => {
        if (controlledValue !== undefined) {
            onValueChange?.(file);
        } else {
            setUncontrolledValue(file);
        }
    };
    const helpText = note || hint;
    const isImage = imageValue instanceof File ? imageValue.type.startsWith("image/") : true;
    const maximumSizeKB = fileSize ?? maxSizeKB ?? (accept.every((type) => type.startsWith("image/")) ? 50 : 5120);

    function formatAcceptedTypes() {
        return accept.map((type) => {
            if (FILE_TYPE_LABELS[type]) return FILE_TYPE_LABELS[type];
            if (type.startsWith(".")) return type.slice(1).toUpperCase();
            return type.split("/").pop()?.toUpperCase() ?? type;
        }).join(", ");
    }

    function isAcceptedFile(file: File) {
        const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
        return accept.includes(file.type) || accept.map((type) => type.toLowerCase()).includes(extension);
    }

    function validateAndSetFile(file: File) {
        setError(null);

        if (!isAcceptedFile(file)) {
            setError(
                `Invalid file type. Please upload ${formatAcceptedTypes()}.`,
            );
            return;
        }

        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > maximumSizeKB) {
            setError(
                `File size exceeds ${maximumSizeKB}KB limit. Your file is ${fileSizeKB.toFixed(1)}KB`,
            );
            return;
        }

        setImage(file);
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) validateAndSetFile(file);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndSetFile(file);
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }

    function handleRemove() {
        setImage(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const acceptString = accept.join(",");

    return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
            {label ? <Label htmlFor={inputId}>{label}</Label> : null}

            <div
                className={cn(
                    "relative flex h-[34px] items-center overflow-hidden rounded-xl border border-border-soft px-3.5 transition-all focus-within:border-border-soft focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-800",
                    "bg-card-nested focus-within:bg-card-nested",
                    variant === "light"
                        ? "border-section-border bg-light focus-within:border-section-border focus-within:bg-light dark:bg-slate-800/60 dark:focus-within:bg-slate-800/60"
                        : "",
                    isDragging && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-50",
                    error && "border-danger focus-within:border-danger"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
            >
                {imageUrl ? (
                    <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                        <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                            {isImage ? (
                                <img
                                    src={imageUrl ?? ""}
                                    alt="Uploaded preview"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <FileText className="size-4 text-primary" />
                            )}
                        </div>
                        <span className="min-w-0 flex-1 truncate text-body-sm text-muted-foreground">
                            {imageValue instanceof File ? imageValue.name : isImage ? "Uploaded image" : "Uploaded document"}
                        </span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                aria-label="Remove image"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="flex h-full min-w-0 flex-1 items-center gap-2 border-0 bg-transparent px-3 text-left"
                    >
                        <Upload className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-body-sm text-muted-foreground">
                            {isImage ? "Click to upload or drag and drop" : "Click to upload a document or drag and drop"}
                        </span>
                    </button>
                )}
            </div>

            <div className="hidden">
                <input
                    ref={fileInputRef}
                    id={inputId}
                    type="file"
                    accept={acceptString}
                    onChange={handleFileChange}
                    disabled={disabled}
                    tabIndex={-1}
                    aria-describedby={error ? errorId : helpText ? hintId : undefined}
                />
            </div>

            {error ? (
                <FieldError id={errorId} className="inline-flex items-center gap-1">
                    <Info className="size-3.5 shrink-0" aria-hidden />
                    {error}
                </FieldError>
            ) : null}
            {!error && helpText ? (
                <HelperText id={hintId}>{helpText}</HelperText>
            ) : null}
        </div>
    );
}
