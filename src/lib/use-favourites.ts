"use client";

import { useCallback } from "react";
import { createStoredStore, useStoredStore } from "@/lib/store";

const EMPTY: string[] = [];

const store = createStoredStore<string[]>("mlbb-codex:favourites", EMPTY, (raw) => {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : null;
    } catch {
        return null;
    }
});

export function useFavourites() {
    const favourites = useStoredStore(store);

    const toggle = useCallback((slug: string) => {
        const current = store.read();
        store.write(current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug]);
    }, []);

    const remove = useCallback((slug: string) => {
        store.write(store.read().filter((value) => value !== slug));
    }, []);

    const clear = useCallback(() => store.write([]), []);

    const isFavourite = useCallback((slug: string) => favourites.includes(slug), [favourites]);

    return { favourites, isFavourite, toggle, remove, clear, ready: true };
}
