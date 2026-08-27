import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral";
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: "bg-[#DCFCE7] text-[#16A34A]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  danger: "bg-[#FEE2E2] text-[#991B1B]",
  neutral: "bg-gray-100 text-gray-600",
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {variant === "success" && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
      )}
      {children}
    </span>
  );
}
