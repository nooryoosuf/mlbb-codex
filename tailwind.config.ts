import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--c-bg)",
                foreground: "var(--c-fg)",
                accent: "var(--c-accent)",
                "accent-dim": "rgba(255, 70, 85, 0.1)",
                "neon-green": "#00ff9d",
                "neon-gold": "#ffb700",
                glass: {
                    bg: "var(--glass-bg)",
                    border: "var(--glass-border)",
                    highlight: "var(--glass-highlight)"
                }
            },
            fontFamily: {
                display: ["var(--font-display)", "Oswald", "sans-serif"],
                ui: ["var(--font-ui)", "Rajdhani", "sans-serif"],
                mono: ["var(--font-mono)", "Share Tech Mono", "monospace"],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(var(--c-grid) 1px, transparent 1px), linear-gradient(90deg, var(--c-grid) 1px, transparent 1px)",
            },
            animation: {
                'grid-move': 'gridMove 60s linear infinite',
                'glitch-in': 'glitchIn 0.5s step-end',
                'glitch-action': 'glitchAction 0.2s infinite',
                'alert-pulse': 'alertPulse 2s infinite',
                'scan': 'scan 3s linear infinite',
                'text-glitch': 'glitch 0.2s infinite',
            },
            keyframes: {
                gridMove: {
                    '0%': { transform: 'translate(0, 0)' },
                    '100%': { transform: 'translate(-50px, -50px)' },
                },
                glitch: {
                    '0%, 100%': { transform: 'translate(0)', textShadow: '2px 2px var(--c-accent), -2px -2px #00ff9d' },
                    '50%': { transform: 'translate(2px, -2px)', textShadow: '-2px 2px var(--c-accent), 2px -2px #00ff9d' },
                },
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
                glitchIn: {
                    '0%': { transform: 'translate(5px, -5px)', clipPath: 'inset(10% 0 10% 0)' },
                    '10%': { transform: 'translate(-5px, 5px)', clipPath: 'inset(20% 0 20% 0)' },
                    '20%': { transform: 'translate(10px, 0)', clipPath: 'inset(0 10% 0 10%)' },
                    '30%': { transform: 'translate(0, 0)' },
                },
                glitchAction: {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-5px, 5px)' },
                    '40%': { transform: 'translate(-5px, -5px)' },
                    '60%': { transform: 'translate(5px, 5px)' },
                    '80%': { transform: 'translate(5px, -5px)' },
                },
                alertPulse: {
                    '0%, 100%': { borderColor: 'var(--c-accent)', background: 'rgba(255, 70, 85, 0.05)' },
                    '50%': { borderColor: 'white', background: 'rgba(255, 70, 85, 0.2)' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
