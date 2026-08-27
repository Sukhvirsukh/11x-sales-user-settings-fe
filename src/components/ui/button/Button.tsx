import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#2563EB] text-white hover:bg-[#1E4FD6] active:bg-[#1D4ED8]",
  secondary: "bg-white text-[#1A1A1A] border border-[#D4D4D8] hover:bg-[#F9FAFB]",
  ghost: "bg-transparent text-[#6B6B76] hover:bg-[#F9FAFB] hover:text-[#1A1A1A]",
};

export function Button({
  variant = "secondary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
