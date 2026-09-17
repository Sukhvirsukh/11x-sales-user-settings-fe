import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleField } from "@/components/design/ToggleField";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === "dark";
    } catch {
        return document.documentElement.classList.contains("dark");
    }
}

export default function SidebarThemeToggle() {
    const [isDark, setIsDark] = useState(getInitialTheme);

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);

        try {
            localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
        } catch {
            // The selected theme still applies when browser storage is unavailable.
        }
    }, [isDark]);

    return (
        <Button
            type="button"
            role="switch"
            aria-checked={isDark}
            variant="bare"
            size="sm"
            onClick={() => setIsDark((current) => !current)}
            className="w-full justify-between px-3 py-1.5! text-foreground dark:text-muted-foreground! dark:hover:bg-muted! dark:hover:text-muted-foreground!"
        >
            <span className="flex items-center gap-2.5">
                {isDark ? (
                    <Moon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                ) : (
                    <Sun className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
                Dark mode
            </span>
            <ToggleField
                pressed={isDark}
                onPressedChange={setIsDark}
                aria-label="Toggle dark mode"
            />
        </Button>
    );
}
