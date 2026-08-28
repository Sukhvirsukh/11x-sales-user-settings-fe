import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useKnowledgeBaseStore } from "@/pages/aiTraining/stores";
import { XIcon } from "lucide-react";

type KnowledgeType =
  | "single-page"
  | "multi-page"
  | "pdfs"
  | "sitemaps"
  | "xml-csv"
  | "custom-text";

interface KnowledgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCENT = "#3576F3";

const knowledgeOptions: {
  id: KnowledgeType;
  label: string;
  placeholder: string;
  format: string;
  fieldLabel: string;
}[] = [
  {
    id: "single-page",
    label: "Single page",
    placeholder: "https://example.com",
    format: "Web pages",
    fieldLabel: "URL",
  },
  {
    id: "multi-page",
    label: "Multi-page",
    placeholder: "https://example.com",
    format: "Web pages",
    fieldLabel: "URL",
  },
  {
    id: "pdfs",
    label: "PDFs",
    placeholder: "https://example.com/file.pdf",
    format: "PDFs",
    fieldLabel: "URL",
  },
  {
    id: "sitemaps",
    label: "Sitemaps",
    placeholder: "https://example.com",
    format: "Sitemaps",
    fieldLabel: "URL",
  },
  {
    id: "xml-csv",
    label: "XML or CSV",
    placeholder: "https://example.com/feed.xml",
    format: "Feed items",
    fieldLabel: "URL",
  },
  {
    id: "custom-text",
    label: "Custom text",
    placeholder: "https://example.com",
    format: "Text",
    fieldLabel: "Content",
  },
];

function formatDate(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;
}

export function KnowledgeModal({ open, onOpenChange }: KnowledgeModalProps) {
  const addItem = useKnowledgeBaseStore((s) => s.addItem);
  const [selectedType, setSelectedType] = useState<KnowledgeType | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  function resetForm() {
    setSelectedType(null);
    setName("");
    setValue("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType || !value.trim()) return;

    const option = knowledgeOptions.find((o) => o.id === selectedType);
    if (!option) return;

    const now = formatDate(new Date());
    addItem({
      id: crypto.randomUUID(),
      url: value.trim(),
      status: "Active",
      createdDate: now,
      lastRefresh: now,
      format: option.format,
    });

    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] gap-0 rounded-xl border-0 outline-none ring-0 bg-white p-0 shadow-lg sm:max-w-[420px]"
      >
        <DialogHeader className="flex bg-[#F1F1F1] flex-row items-center justify-between px-4 py-2 mb-3 rounded-t-lg">
          <DialogTitle className="text-[15px] font-semibold text-[#111113]">
            Add Knowledge
          </DialogTitle>
          <DialogClose
            render={
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent text-[#8A8A94] shadow-none transition-colors hover:bg-[#f5f5f5]"
              />
            }
          >
            <XIcon className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-4 pb-4">
          {knowledgeOptions.map((option) => {
            const isSelected = selectedType === option.id;

            if (!isSelected) {
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(option.id);
                    setName("");
                    setValue("");
                  }}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-left transition-colors hover:bg-[#FAFAFB]"
                >
                  <RadioDot checked={false} />
                  <span className="select-none text-[13px] font-medium text-[#6B6B76]">
                    {option.label}
                  </span>
                </button>
              );
            }

            return (
              <div
                key={option.id}
                className="overflow-hidden rounded-lg border-2"
                style={{ borderColor: ACCENT }}
              >
                <div className="flex">
                  <div
                    className="flex w-10 shrink-0 items-start justify-center pt-3"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <RadioDot checked onAccent />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2.5 p-3">
                    <p className="text-[13px] font-medium text-[#6B6B76]">
                      {option.label}
                    </p>
                    <div className="space-y-1">
                      <Label className="text-[12px] font-normal text-[#8A8A94]">
                        Give name to your data source
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="https://example.com"
                        className="h-8 rounded-md border-[#E4E4E7] text-[13px] placeholder:text-[#A5A5AD]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[12px] font-normal text-[#8A8A94]">
                        {option.fieldLabel}
                      </Label>
                      <Input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={option.placeholder}
                        className="h-8 rounded-md border-[#E4E4E7] text-[13px] placeholder:text-[#A5A5AD]"
                      />
                      {option.id === "custom-text" && (
                        <p className="pt-0.5 text-[11px] leading-snug text-[#8A8A94]">
                          This text would be added to the knowledge of Vitalb,
                          add it carefully
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-0.5">
                      <Button
                        type="submit"
                        size="sm"
                        className="h-7 rounded-md px-3 text-[12px] font-medium text-white hover:opacity-90"
                        style={{ backgroundColor: ACCENT }}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-md border-[#E4E4E7] px-3 text-[12px] font-medium text-[#6B6B76]"
                        onClick={() => handleOpenChange(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RadioDot({
  checked,
  onAccent = false,
}: {
  checked: boolean;
  onAccent?: boolean;
}) {
  return (
    <span className="relative flex h-[14px] w-[14px] shrink-0 items-center justify-center">
      <span
        className={cn(
          "h-[14px] w-[14px] rounded-full border bg-transparent",
          onAccent ? "border-white" : "border-[#C7C7CC]",
        )}
      />
      {checked && (
        <span
          className={cn(
            "absolute h-[6px] w-[6px] rounded-full",
            onAccent ? "bg-white" : "bg-[#3576F3]",
          )}
        />
      )}
    </span>
  );
}
