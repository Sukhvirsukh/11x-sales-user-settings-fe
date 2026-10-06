import { Globe } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function WhatsAppLogo({ className }: LogoProps) {
    return (
        <svg viewBox="0 0 32 32" className={cn("size-10 shrink-0", className)} aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#25D366" />
            <path d="M16 6.6a9.4 9.4 0 0 0-8.1 14.2L6.6 25.4l4.7-1.3A9.4 9.4 0 1 0 16 6.6Z" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
            <path d="M12.7 11.5c.3-.3.8-.3 1 .1l.9 1.6c.2.3.1.7-.1 1l-.5.5c.5 1.2 1.6 2.3 2.8 2.8l.5-.5c.3-.3.7-.3 1-.1l1.6.9c.4.2.4.7.1 1l-.7.8c-.6.6-1.5.7-2.3.4-2.2-.9-3.9-2.6-4.8-4.8-.3-.8-.2-1.7.4-2.3l.1-.3Z" fill="#fff" />
        </svg>
    );
}

export function InstagramLogo({ className }: LogoProps) {
    const id = useId();
    return (
        <svg viewBox="0 0 32 32" className={cn("size-10 shrink-0", className)} aria-hidden="true">
            <defs>
                <radialGradient id={id} cx="0.3" cy="1.05" r="1.25">
                    <stop offset="0" stopColor="#FEDA75" />
                    <stop offset="0.25" stopColor="#FA7E1E" />
                    <stop offset="0.5" stopColor="#D62976" />
                    <stop offset="0.75" stopColor="#962FBF" />
                    <stop offset="1" stopColor="#4F5BD5" />
                </radialGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
            <rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="16" cy="16" r="3.8" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="20.6" cy="11.4" r="1.1" fill="#fff" />
        </svg>
    );
}

export function MessengerLogo({ className }: LogoProps) {
    const id = useId();
    return (
        <svg viewBox="0 0 32 32" className={cn("size-10 shrink-0", className)} aria-hidden="true">
            <defs>
                <linearGradient id={id} x1="0.2" y1="1" x2="0.8" y2="0">
                    <stop offset="0" stopColor="#0099FF" />
                    <stop offset="0.6" stopColor="#A033FF" />
                    <stop offset="1" stopColor="#FF5C87" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
            <path d="M16 6.5c-5.4 0-9.5 3.9-9.5 9.2 0 2.8 1.1 5.2 3 6.9v3l2.8-1.5c1.1.3 2.3.5 3.7.5 5.4 0 9.5-3.9 9.5-9.2S21.4 6.5 16 6.5Z" fill="#fff" />
            <path d="m10.6 18.6 3.1-4.9 2.6 2 3.8-2.1-3.1 4.9-2.6-2-3.8 2.1Z" fill={`url(#${id})`} />
        </svg>
    );
}

export function WebsiteLogo({ className }: LogoProps) {
    return (
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand", className)} aria-hidden="true">
            <Globe className="size-5" />
        </span>
    );
}
