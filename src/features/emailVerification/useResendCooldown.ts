import { useCallback, useEffect, useState } from "react";

/** How long the resend button stays disabled after a verification email is sent. */
export const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

/** Stored value is the epoch ms at which a resend becomes allowed again. */
const STORAGE_KEY = "vitalb.verifyEmailResendAllowedAt";

function storageKey(email: string) {
    return `${STORAGE_KEY}:${email}`;
}

/** Epoch ms until which another resend is blocked (0 when none). */
function readDeadline(email: string): number {
    if (!email) return 0;

    try {
        const raw = window.localStorage.getItem(storageKey(email));
        const value = raw ? Number(raw) : Number.NaN;

        return Number.isFinite(value) ? value : 0;
    } catch {
        // Storage unavailable (private mode, blocked cookies): never block.
        return 0;
    }
}

export function formatRemaining(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Resend cooldown for one email address. The deadline lives in localStorage so
 * a page reload keeps the button disabled for the remainder of the five minutes.
 */
export function useResendCooldown(email: string) {
    const [deadline, setDeadline] = useState(() => readDeadline(email));
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (deadline <= Date.now()) return;

        const id = window.setInterval(() => {
            setNow(Date.now());
            if (Date.now() >= deadline) window.clearInterval(id);
        }, 1000);

        return () => window.clearInterval(id);
    }, [deadline]);

    const start = useCallback(() => {
        const next = Date.now() + RESEND_COOLDOWN_MS;

        try {
            window.localStorage.setItem(storageKey(email), String(next));
        } catch {
            // In-memory cooldown still applies for this session.
        }

        setDeadline(next);
        setNow(Date.now());
    }, [email]);

    const remainingMs = Math.max(0, deadline - now);

    return { isCoolingDown: remainingMs > 0, remainingMs, start };
}
