import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                elevated: "var(--bg-elevated)",
                subtle: "var(--bg-subtle)",
                fg: "var(--fg)",
                muted: "var(--fg-muted)",
                faint: "var(--fg-faint)",
                accent: "var(--accent)",
                "accent-strong": "var(--accent-strong)",
                "accent-contrast": "var(--accent-contrast)",
                "accent-soft": "var(--accent-soft)",
                line: "var(--border)",
                "line-strong": "var(--border-strong)",
                danger: "var(--danger)",
                success: "var(--success)",
            },
            fontFamily: {
                display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
                ui: ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
            borderRadius: {
                card: "0.75rem",
                panel: "1rem",
            },
            boxShadow: {
                panel: "var(--shadow)",
            },
            maxWidth: {
                shell: "84rem",
            },
            transitionTimingFunction: {
                editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            keyframes: {
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(12px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                "fade-in": "fade-in 0.4s ease-out both",
                shimmer: "shimmer 1.6s infinite",
            },
        },
    },
    plugins: [],
} satisfies Config;
