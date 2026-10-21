import type { NextConfig } from "next";

// The site is fully static: all data is baked in at build time and artwork is
// served from /public, so it can be exported and hosted on GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
};

export default nextConfig;
