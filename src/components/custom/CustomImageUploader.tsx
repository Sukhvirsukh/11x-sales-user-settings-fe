import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

interface CustomImageUploaderProps {
  label: string;
  hint?: string;
  note?: string;
  value?: string | File | null;
  onValueChange?: (file: File | null) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  accept?: string[];
  maxSizeKB?: number;
}

const DEFAULT_ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const DEFAULT_ACCEPT_EXTENSIONS = ".png,.jpg,.jpeg,.gif,.webp";

export function CustomImageUploader({
  label,
  hint,
  note,
  value: controlledValue,
  onValueChange,
  id,
  disabled = false,
  className,
  accept = DEFAULT_ACCEPT,
  maxSizeKB = 50,
}: CustomImageUploaderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrl =
    controlledValue instanceof File
      ? URL.createObjectURL(controlledValue)
      : (controlledValue ?? uncontrolledValue);
  const setImage = controlledValue !== undefined ? onValueChange : setUncontrolledValue;
  const helpText = note || hint;

  function validateAndSetFile(file: File) {
    setError(null);

    if (!accept.includes(file.type)) {
      setError(
        `Invalid file type. Please upload ${accept.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`,
      );
      return;
    }

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      setError(
        `File size exceeds ${maxSizeKB}KB limit. Your file is ${fileSizeKB.toFixed(1)}KB`,
      );
      return;
    }

    setImage?.(file);
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
    setImage?.(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const acceptString =
    accept.length === DEFAULT_ACCEPT.length
      ? DEFAULT_ACCEPT_EXTENSIONS
      : accept.map((t) => `.${t.split("/")[1]}`).join(",");

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <CustomLabel htmlFor={inputId}>{label}</CustomLabel>

      <div
        className={cn(
          "relative flex h-10 items-center overflow-hidden rounded-xl border border-dashed border-border bg-card transition-colors",
          isDragging && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
      >
        {imageUrl ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
            <div className="size-7 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="size-full object-cover"
              />
            </div>
            <span className="min-w-0 flex-1 truncate text-body-sm text-muted-foreground">
              {controlledValue instanceof File ? controlledValue.name : "Uploaded image"}
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
              Click to upload or drag and drop
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

      {error && (
        <p id={errorId} role="alert" className="text-caption leading-snug text-destructive">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={hintId} className="text-caption leading-snug text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
