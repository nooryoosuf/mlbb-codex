"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { asset } from "@/lib/base-path";
import {
    MONTHS,
    monthName,
    pad,
    parseDateKey,
    type BirthdayHero,
} from "@/lib/birthdays";

const CARD_W = 1080;
const CARD_H = 1350;
const INK = "#f2f0e9";
const MUTED = "#a09e96";
const FAINT = "#63625d";
const BG = "#08090b";
const ACCENT = "#e30b5c";

interface CardState {
    status: "loading" | "ready" | "error";
    url?: string;
    file?: File;
    filename?: string;
}

function loadImage(src: string | null): Promise<HTMLImageElement | null> {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

function drawCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sx = (image.width - sourceWidth) / 2;
    const sy = Math.max(0, (image.height - sourceHeight) / 2.4);
    ctx.drawImage(image, sx, sy, sourceWidth, sourceHeight, x, y, width, height);
}

function initials(name: string): string {
    return name
        .split(/[\s'-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function drawPortrait(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    hero: BirthdayHero,
    x: number,
    y: number,
    width: number,
    height: number
) {
    ctx.save();
    ctx.fillStyle = "#15181c";
    ctx.fillRect(x, y, width, height);
    if (image) {
        drawCover(ctx, image, x, y, width, height);
    } else {
        ctx.fillStyle = "rgba(227, 11, 92, 0.14)";
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = "rgba(242, 240, 233, 0.22)";
        ctx.font = "700 64px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(initials(hero.name), x + width / 2, y + height / 2 + 22);
        ctx.textAlign = "left";
    }
    ctx.fillStyle = "rgba(242, 240, 233, 0.18)";
    ctx.fillRect(x, y, width, 1);
    ctx.fillRect(x, y + height - 1, width, 1);
    ctx.fillRect(x, y, 1, height);
    ctx.fillRect(x + width - 1, y, 1, height);
    ctx.restore();
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
): number {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > maxWidth && line) {
            lines.push(line);
            line = word;
            if (lines.length === maxLines - 1) break;
        } else {
            line = next;
        }
    }
    if (line && lines.length < maxLines) lines.push(line);

    let cursor = y;
    for (let index = 0; index < lines.length; index += 1) {
        let value = lines[index];
        if (index === maxLines - 1 && words.join(" ").length > lines.join(" ").length) {
            while (ctx.measureText(`${value}...`).width > maxWidth && value.length > 0) {
                value = value.slice(0, -1);
            }
            value = `${value}...`;
        }
        ctx.fillText(value, x, cursor);
        cursor += lineHeight;
    }
    return cursor;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let value = text;
    while (value.length > 0 && ctx.measureText(`${value}...`).width > maxWidth) {
        value = value.slice(0, -1);
    }
    return `${value}...`;
}

function shareLocation(): string {
    if (typeof window === "undefined") return "MLBB CODEX";
    const path = window.location.pathname.endsWith("/")
        ? window.location.pathname.slice(0, -1)
        : window.location.pathname;
    return `${window.location.host}${path}`;
}

async function renderCard(heroes: BirthdayHero[], dateKey: string): Promise<Blob> {
    const parsed = parseDateKey(dateKey);
    if (!parsed || heroes.length === 0) throw new Error("Nothing to render");

    const canvas = document.createElement("canvas");
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    const [logo, portraits] = await Promise.all([
        loadImage(asset("/brand/codex-logo-white.png")),
        Promise.all(heroes.slice(0, 3).map((hero) => loadImage(asset(hero.portrait)))),
    ]);

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    const glow = ctx.createRadialGradient(980, 80, 10, 980, 80, 920);
    glow.addColorStop(0, "rgba(227, 11, 92, 0.30)");
    glow.addColorStop(0.5, "rgba(227, 11, 92, 0.08)");
    glow.addColorStop(1, "rgba(8, 9, 11, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    ctx.strokeStyle = "rgba(242, 240, 233, 0.045)";
    ctx.lineWidth = 1;
    for (let x = 64; x < CARD_W; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CARD_H);
        ctx.stroke();
    }
    for (let y = 64; y < CARD_H; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CARD_W, y);
        ctx.stroke();
    }

    if (logo) ctx.drawImage(logo, 64, 52, 84, 81);

    let brandX = logo ? 164 : 64;
    ctx.textBaseline = "alphabetic";
    ctx.font = "700 32px Arial, sans-serif";
    ctx.fillStyle = INK;
    ctx.fillText("MLBB", brandX, 102);
    brandX += ctx.measureText("MLBB").width + 2;
    ctx.fillStyle = ACCENT;
    ctx.fillText("/", brandX, 102);
    brandX += ctx.measureText("/").width + 2;
    ctx.fillStyle = INK;
    ctx.fillText("CODEX", brandX, 102);

    ctx.textAlign = "right";
    ctx.font = "500 18px monospace";
    ctx.fillStyle = FAINT;
    ctx.fillText("COMMUNITY / BIRTHDAY TWIN", 1016, 96);
    ctx.textAlign = "left";

    ctx.fillStyle = ACCENT;
    ctx.fillRect(64, 146, 64, 4);

    ctx.fillStyle = ACCENT;
    ctx.font = "700 26px monospace";
    ctx.fillText(monthName(parsed.month).toUpperCase(), 64, 254);

    ctx.fillStyle = INK;
    ctx.font = "900 196px Arial, sans-serif";
    ctx.fillText(pad(parsed.day), 56, 438);

    ctx.fillStyle = INK;
    ctx.font = "900 56px Arial, sans-serif";
    ctx.fillText("BIRTHDAY", 526, 306);
    ctx.fillText(heroes.length > 1 ? "TWINS" : "TWIN", 526, 370);

    ctx.fillStyle = MUTED;
    ctx.font = "500 24px Arial, sans-serif";
    ctx.fillText(
        heroes.length > 1
            ? `${heroes.length} heroes share this day.`
            : "One hero shares this day.",
        526,
        422
    );

    ctx.fillStyle = FAINT;
    ctx.font = "500 17px monospace";
    ctx.fillText("SOURCED FROM THE MLBB WIKI", 526, 462);

    ctx.fillStyle = "rgba(242, 240, 233, 0.12)";
    ctx.fillRect(64, 518, 952, 1);

    const featured = heroes.slice(0, 3);

    if (featured.length === 1) {
        const hero = featured[0];
        drawPortrait(ctx, portraits[0] ?? null, hero, 64, 574, 360, 590);

        ctx.fillStyle = ACCENT;
        ctx.font = "700 18px monospace";
        ctx.fillText("TWIN 01", 468, 610);

        ctx.fillStyle = INK;
        ctx.font = "900 74px Arial, sans-serif";
        ctx.fillText(fitText(ctx, hero.name, 548), 468, 702);

        ctx.fillStyle = MUTED;
        ctx.font = "500 28px Arial, sans-serif";
        ctx.fillText(fitText(ctx, hero.title ?? "Hero of the Land of Dawn", 548), 468, 746);

        ctx.fillStyle = ACCENT;
        ctx.font = "700 19px monospace";
        ctx.fillText(hero.roles.join(" / ").toUpperCase(), 468, 794);

        ctx.fillStyle = MUTED;
        ctx.font = "400 26px Arial, sans-serif";
        const end = wrapText(ctx, hero.fact, 468, 854, 548, 37, 5);

        ctx.fillStyle = FAINT;
        ctx.font = "500 17px monospace";
        ctx.fillText("MLBB CODEX / COMMUNITY", 468, Math.min(1120, end + 32));
    } else {
        const gap = 24;
        const panelWidth = (952 - gap * (featured.length - 1)) / featured.length;
        const panelHeight = 566;

        featured.forEach((hero, index) => {
            const x = 64 + index * (panelWidth + gap);
            drawPortrait(ctx, portraits[index] ?? null, hero, x, 574, panelWidth, panelHeight);

            const overlay = ctx.createLinearGradient(0, 574 + panelHeight - 210, 0, 574 + panelHeight);
            overlay.addColorStop(0, "rgba(4, 5, 6, 0)");
            overlay.addColorStop(1, "rgba(4, 5, 6, 0.96)");
            ctx.fillStyle = overlay;
            ctx.fillRect(x, 574 + panelHeight - 210, panelWidth, 210);

            ctx.fillStyle = "rgba(242, 240, 233, 0.16)";
            ctx.fillRect(x + 18, 594, 18, 3);

            ctx.fillStyle = INK;
            ctx.font = `900 ${featured.length === 2 ? 54 : 40}px Arial, sans-serif`;
            ctx.fillText(fitText(ctx, hero.name, panelWidth - 36), x + 20, 1074);

            ctx.fillStyle = "rgba(242, 240, 233, 0.72)";
            ctx.font = `500 ${featured.length === 2 ? 20 : 16}px monospace`;
            ctx.fillText(fitText(ctx, hero.roles.join(" / ").toUpperCase(), panelWidth - 36), x + 20, 1108);
        });
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 2;
    ctx.font = "900 280px Arial, sans-serif";
    ctx.strokeText("08", 840, 1090);

    ctx.fillStyle = "rgba(242, 240, 233, 0.12)";
    ctx.fillRect(64, 1218, 952, 1);

    ctx.fillStyle = INK;
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText("Find the hero who shares your birthday.", 64, 1272);

    ctx.fillStyle = ACCENT;
    ctx.font = "700 17px monospace";
    ctx.fillText("BIRTHDAY TWIN", 64, 1310);

    ctx.textAlign = "right";
    ctx.fillStyle = FAINT;
    ctx.font = "500 18px monospace";
    ctx.fillText(fitText(ctx, shareLocation(), 520), 1016, 1272);

    ctx.fillStyle = FAINT;
    ctx.font = "500 15px monospace";
    ctx.fillText("SOURCE: MOBILE LEGENDS WIKI", 1016, 1310);
    ctx.textAlign = "left";

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Card export failed");
    return blob;
}

export default function BirthdayCard({
    heroes,
    dateKey,
}: {
    heroes: BirthdayHero[];
    dateKey: string;
}) {
    const [state, setState] = useState<CardState>({ status: "loading" });
    const [message, setMessage] = useState("");
    const heroKey = heroes.map((hero) => hero.slug).join("|");

    useEffect(() => {
        let cancelled = false;
        let objectUrl: string | null = null;

        renderCard(heroes, dateKey)
            .then((blob) => {
                if (cancelled) return;
                objectUrl = URL.createObjectURL(blob);
                const filename = `mlbb-codex-birthday-${dateKey}.png`;
                setState({
                    status: "ready",
                    url: objectUrl,
                    file: new File([blob], filename, { type: "image/png" }),
                    filename,
                });
            })
            .catch(() => {
                if (!cancelled) setState({ status: "error" });
            });

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [heroKey, dateKey, heroes]);

    const url = state.url;
    const file = state.file;

    function currentShareUrl(): string {
        const value = new URL(window.location.href);
        value.searchParams.set("date", dateKey);
        return value.toString();
    }

    function download() {
        if (!url) return;
        const link = document.createElement("a");
        link.href = url;
        link.download = state.filename ?? `mlbb-codex-birthday-${dateKey}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setMessage("Card downloaded. Share it anywhere.");
    }

    async function copyLink() {
        const value = currentShareUrl();
        try {
            await navigator.clipboard.writeText(value);
            setMessage("Link copied.");
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            setMessage("Link copied.");
        }
    }

    async function share() {
        if (!file) {
            download();
            return;
        }

        const names = heroes.map((hero) => hero.name).join(", ");
        const payload = {
            files: [file],
            title: `Birthday twin: ${names}`,
            text: `I share a birthday with ${names}. Find your birthday twin on MLBB Codex.`,
            url: currentShareUrl(),
        };

        try {
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share(payload);
                setMessage("Shared.");
                return;
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
        }

        download();
    }

    return (
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
            <div className="min-w-0">
                <div className="eyebrow">Share the reveal</div>
                <h3 className="display mt-3 text-3xl sm:text-4xl">Your birthday card</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                    A 4:5 card with the date, the hero art and the Codex mark. Share it
                    natively on your phone, download it, or send the link.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={share}
                        disabled={state.status !== "ready"}
                        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Share2 size={14} aria-hidden="true" />
                        Share card
                    </button>
                    <button
                        type="button"
                        onClick={download}
                        disabled={state.status !== "ready"}
                        className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Download size={14} aria-hidden="true" />
                        Download
                    </button>
                    <button type="button" onClick={copyLink} className="btn btn-ghost">
                        <Copy size={14} aria-hidden="true" />
                        Copy link
                    </button>
                </div>

                <p
                    className="mt-4 flex min-h-5 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-success"
                    role="status"
                    aria-live="polite"
                >
                    {message && (
                        <>
                            <Check size={12} aria-hidden="true" />
                            {message}
                        </>
                    )}
                </p>

                <p className="mt-8 max-w-md text-xs leading-relaxed text-faint">
                    The card is drawn in your browser. No image is uploaded. Hero birthdays
                    come from the Mobile Legends Wiki profiles linked on each result.
                </p>
            </div>

            <div className="mx-auto w-full max-w-sm lg:mx-0">
                <div className="border border-line bg-elevated p-2">
                    {state.status === "ready" && state.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={state.url}
                            alt={`Birthday twin share card for ${heroes
                                .map((hero) => hero.name)
                                .join(", ")} on ${monthName(parseDateKey(dateKey)?.month ?? 1)} ${parseDateKey(dateKey)?.day ?? ""}`}
                            width={CARD_W}
                            height={CARD_H}
                            className="block h-auto w-full"
                        />
                    ) : state.status === "error" ? (
                        <div className="grid aspect-[4/5] place-items-center px-6 text-center">
                            <p className="text-sm leading-relaxed text-muted">
                                The card could not be rendered in this browser. You can still
                                copy the link and share the date.
                            </p>
                        </div>
                    ) : (
                        <div className="grid aspect-[4/5] place-items-center bg-subtle">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                                Rendering card
                            </span>
                        </div>
                    )}
                </div>
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                    {MONTHS[(parseDateKey(dateKey)?.month ?? 1) - 1].name}{" "}
                    {parseDateKey(dateKey)?.day ?? 1} / 1080 x 1350
                </p>
            </div>
        </div>
    );
}
