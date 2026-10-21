/**
 * When the site is published to GitHub Pages as a project site it lives under
 * /<repo>. Next rewrites its own assets automatically, but plain <img> paths
 * pointing at /public do not get the prefix, so every local asset goes through
 * `asset()`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string | null): string | null {
    if (!path) return null;
    if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
    return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
