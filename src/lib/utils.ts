import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Display-friendly casing for raw API values.
 * "ADMIN" -> "Admin", "SUPER_ADMIN" -> "Super Admin", "" -> "".
 */
export function capitalize(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export type NumberFormat = "compact" | "percent";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Display-friendly number formatting for API values.
 * Accepts numbers or numeric strings and returns "—" for anything missing or
 * non-numeric, so NaN never reaches the UI.
 * "compact": 40000 -> "40K". "percent": 70 -> "70%".
 */
export function formatNumber(
  value: number | string | null | undefined,
  format: NumberFormat = "compact",
): string {
  if (typeof value === "string" && value.trim() === "") return "—";

  const number = typeof value === "string" ? Number(value) : value;
  if (typeof number !== "number" || !Number.isFinite(number)) return "—";

  return format === "percent" ? `${number}%` : compactNumberFormatter.format(number);
}

export type DateFormat = "numeric" | "long";

export function dateFormater(
  date: Date | string | null,
  format: DateFormat = "numeric",
): string {
  if (!date) return ""
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""

  if (format === "long") {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d)
  }

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${day}/${month}/${year}`
}
