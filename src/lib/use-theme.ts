"use client";

import { useCallback, useEffect } from "react";
import { createStoredStore, useStoredStore } from "@/lib/store";

export type Theme = "dark" | "light";

const store = createStoredStore<Theme>("mlbb-codex:theme", "dark", (raw) => {
    const value = raw.replace(/"/g, "");
    return value === "light" || value === "dark" ? value : null;
});

function apply(theme: Theme) {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.dataset.theme = theme;
}

export function useTheme() {
    const theme = useStoredStore(store);

    // Keep the <html> class in sync with the stored preference on mount.
    useEffect(() => {
        apply(theme);
    }, [theme]);

    const setTheme = useCallback((next: Theme) => {
        store.write(next);
    }, []);

    const toggle = useCallback(() => {
        setTheme(store.read() === "dark" ? "light" : "dark");
    }, [setTheme]);

    return { theme, setTheme, toggle };
}
