"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True only after hydration, so client-only values can render safely. */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false
    );
}

/**
 * Minimal external store backed by localStorage. Returns a cached snapshot so
 * useSyncExternalStore stays referentially stable, and notifies every consumer
 * when the value changes.
 */
export function createStoredStore<T>(
    key: string,
    fallback: T,
    parse: (raw: string) => T | null
) {
    let cache: T | null = null;
    const listeners = new Set<() => void>();

    function read(): T {
        if (cache !== null) return cache;
        try {
            const raw = window.localStorage.getItem(key);
            cache = raw === null ? fallback : parse(raw) ?? fallback;
        } catch {
            cache = fallback;
        }
        return cache;
    }

    function write(value: T) {
        cache = value;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* storage may be unavailable; keep in-memory */
        }
        listeners.forEach((listener) => listener());
    }

    function subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }

    return { read, write, subscribe, fallback };
}

export function useStoredStore<T>(store: ReturnType<typeof createStoredStore<T>>): T {
    return useSyncExternalStore(store.subscribe, store.read, () => store.fallback);
}

/** Subscribe to a boolean derived from the window scroll position. */
export function useScrolled(threshold = 8): boolean {
    return useSyncExternalStore(
        (listener) => {
            window.addEventListener("scroll", listener, { passive: true });
            return () => window.removeEventListener("scroll", listener);
        },
        () => window.scrollY > threshold,
        () => false
    );
}
