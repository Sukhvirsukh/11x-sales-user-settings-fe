import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: TArgs) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
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
