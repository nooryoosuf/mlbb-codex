"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Crosshair, Minus, Plus, Search, X } from "lucide-react";
import { RELATION_META, RELATION_TYPES, type RelationType } from "@/data/lore";

export interface GraphNode {
    slug: string;
    name: string;
    regionId: string | null;
    regionName: string;
    featured: boolean;
    degree: number;
}

export interface GraphEdge {
    a: string;
    b: string;
    type: RelationType;
    label: string;
    note?: string;
}

interface Point {
    x: number;
    y: number;
    node: GraphNode;
}

const CELL_W = 300;
const CELL_H = 250;
const PADDING = 60;
const COLUMNS = 4;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function hash(value: string): number {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        result ^= value.charCodeAt(index);
        result = Math.imul(result, 16777619);
    }
    return (result >>> 0) / 4294967295;
}

function buildLayout(nodes: GraphNode[]) {
    const groups = new Map<string, { label: string; nodes: GraphNode[] }>();
    for (const node of nodes) {
        const key = node.regionId ?? "unplaced";
        const group = groups.get(key) ?? { label: node.regionName, nodes: [] };
        group.nodes.push(node);
        groups.set(key, group);
    }

    const ordered = [...groups.entries()].sort(
        (left, right) => right[1].nodes.length - left[1].nodes.length || left[1].label.localeCompare(right[1].label)
    );

    const positions = new Map<string, Point>();
    const centers: { x: number; y: number; label: string; count: number }[] = [];

    ordered.forEach(([, group], groupIndex) => {
        const column = groupIndex % COLUMNS;
        const row = Math.floor(groupIndex / COLUMNS);
        const cx = PADDING + column * CELL_W + CELL_W / 2;
        const cy = PADDING + row * CELL_H + CELL_H / 2;
        const spread = Math.min(78, 16 + Math.sqrt(group.nodes.length) * 17);

        group.nodes
            .slice()
            .sort((left, right) => left.name.localeCompare(right.name))
            .forEach((node, nodeIndex) => {
                const radius = spread * Math.sqrt((nodeIndex + 0.6) / group.nodes.length);
                const angle = nodeIndex * GOLDEN + hash(node.slug) * Math.PI;
                positions.set(node.slug, {
                    x: cx + Math.cos(angle) * radius,
                    y: cy + Math.sin(angle) * radius,
                    node,
                });
            });

        centers.push({ x: cx, y: cy, label: group.label, count: group.nodes.length });
    });

    const rows = Math.ceil(ordered.length / COLUMNS);
    return {
        positions,
        centers,
        width: PADDING * 2 + COLUMNS * CELL_W,
        height: PADDING * 2 + rows * CELL_H,
    };
}

export default function RelationshipGraph({
    nodes,
    edges,
}: {
    nodes: GraphNode[];
    edges: GraphEdge[];
}) {
    const [activeTypes, setActiveTypes] = useState<Set<RelationType>>(new Set(RELATION_TYPES));
    const [selected, setSelected] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

    const layout = useMemo(() => buildLayout(nodes), [nodes]);
    const nodeBySlug = useMemo(() => new Map(nodes.map((node) => [node.slug, node])), [nodes]);

    const matching = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return null;
        return new Set(nodes.filter((node) => node.name.toLowerCase().includes(needle)).map((node) => node.slug));
    }, [nodes, query]);

    const visibleEdges = useMemo(
        () => edges.filter((edge) => activeTypes.has(edge.type)),
        [edges, activeTypes]
    );

    const selectedNode = selected ? nodeBySlug.get(selected) ?? null : null;
    const selectedEdges = useMemo(() => {
        if (!selected) return [];
        return visibleEdges
            .filter((edge) => edge.a === selected || edge.b === selected)
            .map((edge) => ({
                edge,
                other: nodeBySlug.get(edge.a === selected ? edge.b : edge.a),
            }))
            .filter((entry) => Boolean(entry.other));
    }, [selected, visibleEdges, nodeBySlug]);

    const focus = hovered ?? selected;
    const focusNeighbours = useMemo(() => {
        const set = new Set<string>();
        if (!focus) return set;
        for (const edge of visibleEdges) {
            if (edge.a === focus) set.add(edge.b);
            if (edge.b === focus) set.add(edge.a);
        }
        return set;
    }, [focus, visibleEdges]);
    const needleLower = query.trim().toLowerCase();
    const filteredCount = matching ? matching.size : nodes.length;

    function toggleType(type: RelationType) {
        setActiveTypes((current) => {
            const next = new Set(current);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    }

    function resetView() {
        setScale(1);
        setPan({ x: 0, y: 0 });
    }

    const cx = layout.width / 2;
    const cy = layout.height / 2;

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="border border-line bg-elevated">
                <div className="flex flex-col gap-3 border-b border-line p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {RELATION_TYPES.map((type) => {
                            const meta = RELATION_META[type];
                            const on = activeTypes.has(type);
                            const count = edges.filter((edge) => edge.type === type).length;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => toggleType(type)}
                                    aria-pressed={on}
                                    className={`inline-flex h-7 items-center gap-1.5 border px-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
                                        on ? "border-line-strong text-fg" : "border-line text-faint line-through"
                                    }`}
                                >
                                    <span
                                        className="h-2 w-2 shrink-0"
                                        style={{ backgroundColor: on ? meta.color : "transparent", border: `1px solid ${meta.color}` }}
                                    />
                                    {meta.label}
                                    <span className="text-faint">{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="relative flex min-w-0 flex-1 items-center">
                            <Search size={12} className="pointer-events-none absolute left-2.5 text-faint" aria-hidden="true" />
                            <span className="sr-only">Highlight a hero in the graph</span>
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Highlight a hero"
                                className="h-8 w-full border border-line bg-bg pl-8 pr-8 font-mono text-[10px] text-fg outline-none placeholder:text-faint focus:border-accent"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="absolute right-1.5 grid h-5 w-5 place-items-center text-faint hover:text-fg"
                                    aria-label="Clear highlight"
                                >
                                    <X size={11} aria-hidden="true" />
                                </button>
                            )}
                        </label>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                            {filteredCount} / {nodes.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setScale((value) => Math.max(0.6, Math.round((value - 0.2) * 10) / 10))}
                                className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                                aria-label="Zoom out"
                            >
                                <Minus size={13} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setScale((value) => Math.min(2.4, Math.round((value + 0.2) * 10) / 10))}
                                className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                                aria-label="Zoom in"
                            >
                                <Plus size={13} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={resetView}
                                className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                                aria-label="Reset view"
                            >
                                <Crosshair size={13} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative max-h-[42rem] overflow-auto bg-bg">
                    <svg
                        viewBox={`0 0 ${layout.width} ${layout.height}`}
                        className="h-auto w-full min-w-[42rem] touch-pan-y select-none"
                        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
                        role="img"
                        aria-label="Relationship graph of connected heroes, grouped by region"
                        onPointerDown={(event) => {
                            drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
                            (event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId);
                        }}
                        onPointerMove={(event) => {
                            if (!drag.current) return;
                            setPan({
                                x: drag.current.panX + (event.clientX - drag.current.x),
                                y: drag.current.panY + (event.clientY - drag.current.y),
                            });
                        }}
                        onPointerUp={() => {
                            drag.current = null;
                        }}
                        onPointerLeave={() => {
                            drag.current = null;
                        }}
                    >
                        <g transform={`translate(${cx + pan.x} ${cy + pan.y}) scale(${scale}) translate(${-cx} ${-cy})`}>
                            {layout.centers.map((center) => (
                                <g key={center.label}>
                                    <ellipse
                                        cx={center.x}
                                        cy={center.y}
                                        rx={112}
                                        ry={104}
                                        fill="none"
                                        stroke="var(--border)"
                                        strokeDasharray="2 5"
                                    />
                                    <text
                                        x={center.x}
                                        y={center.y - 116}
                                        textAnchor="middle"
                                        className="fill-current font-mono"
                                        style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase" }}
                                        fill="var(--fg-faint)"
                                    >
                                        {center.label}
                                    </text>
                                </g>
                            ))}

                            {visibleEdges.map((edge, index) => {
                                const from = layout.positions.get(edge.a);
                                const to = layout.positions.get(edge.b);
                                if (!from || !to) return null;
                                const meta = RELATION_META[edge.type];
                                const incident = focus === edge.a || focus === edge.b;
                                const dimmed = Boolean(focus && !incident);
                                const midX = (from.x + to.x) / 2;
                                const midY = (from.y + to.y) / 2;
                                const dx = to.x - from.x;
                                const dy = to.y - from.y;
                                const length = Math.hypot(dx, dy) || 1;
                                const bend = Math.min(42, length * 0.18) * (index % 2 === 0 ? 1 : -1);
                                const controlX = midX - (dy / length) * bend;
                                const controlY = midY + (dx / length) * bend;

                                return (
                                    <path
                                        key={`${edge.a}-${edge.b}-${edge.type}`}
                                        d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
                                        fill="none"
                                        stroke={meta.color}
                                        strokeWidth={incident ? 1.8 : 1}
                                        strokeOpacity={dimmed ? 0.08 : incident ? 0.9 : 0.32}
                                        style={{ transition: "stroke-opacity 200ms" }}
                                    />
                                );
                            })}

                            {[...layout.positions.values()].map((point) => {
                                const { node } = point;
                                const isSelected = selected === node.slug;
                                const isHovered = hovered === node.slug;
                                const isMatch = matching ? matching.has(node.slug) : null;
                                const dim =
                                    isMatch === false ||
                                    Boolean(focus && !isSelected && !isHovered && !focusNeighbours.has(node.slug));
                                const showLabel =
                                    isSelected || isHovered || node.featured || (needleLower.length > 0 && isMatch === true);

                                return (
                                    <g
                                        key={node.slug}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${node.name} — ${node.regionName}`}
                                        aria-pressed={isSelected}
                                        transform={`translate(${point.x} ${point.y})`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelected(isSelected ? null : node.slug);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                setSelected(isSelected ? null : node.slug);
                                            }
                                        }}
                                        onPointerEnter={() => setHovered(node.slug)}
                                        onPointerLeave={() => setHovered(null)}
                                        opacity={dim ? 0.2 : 1}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <circle
                                            r={isSelected || isHovered ? 8 : 5.5}
                                            fill={isSelected ? "var(--accent)" : "var(--bg)"}
                                            stroke={isSelected ? "var(--accent)" : "var(--fg-muted)"}
                                            strokeWidth={1.4}
                                        />
                                        {node.degree >= 6 && !isSelected && !isHovered && (
                                            <circle r={9.5} fill="none" stroke="var(--accent)" strokeOpacity={0.35} strokeWidth={1} />
                                        )}
                                        {showLabel && (
                                            <text
                                                x={0}
                                                y={-11}
                                                textAnchor="middle"
                                                className="fill-current font-mono"
                                                style={{ fontSize: 9, letterSpacing: "0.06em" }}
                                                fill={isSelected ? "var(--accent)" : "var(--fg)"}
                                            >
                                                {node.name}
                                            </text>
                                        )}
                                        <title>{`${node.name} · ${node.regionName}`}</title>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>

                <p className="border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    Drag to pan · scroll view · click a node to inspect
                </p>
            </div>

            <aside className="space-y-3">
                {selectedNode ? (
                    <div className="border border-line bg-elevated">
                        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
                            <div className="min-w-0">
                                <h3 className="display truncate text-2xl leading-none">{selectedNode.name}</h3>
                                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    {selectedNode.regionName} · {selectedNode.degree} links
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="grid h-6 w-6 shrink-0 place-items-center text-faint hover:text-fg"
                                aria-label="Clear selection"
                            >
                                <X size={13} aria-hidden="true" />
                            </button>
                        </div>

                        <ul className="max-h-[24rem] divide-y divide-line overflow-auto">
                            {selectedEdges.map(({ edge, other }) => (
                                <li key={`${other!.slug}-${edge.type}`}>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(other!.slug)}
                                        className="group w-full px-4 py-2.5 text-left transition-colors hover:bg-subtle"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="h-1.5 w-1.5 shrink-0"
                                                style={{ backgroundColor: RELATION_META[edge.type].color }}
                                            />
                                            <span className="text-sm text-fg transition-colors group-hover:text-accent">
                                                {other!.name}
                                            </span>
                                            <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                                {edge.label}
                                            </span>
                                        </span>
                                        {edge.note && (
                                            <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                                                {edge.note}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={`/lore/heroes/${selectedNode.slug}`}
                            className="flex items-center justify-between border-t border-line px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-subtle"
                        >
                            Open full dossier
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="border border-line bg-elevated p-4">
                        <h3 className="display text-lg leading-none">How to read this</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted">
                            Every line is a curated relationship with a cited source. Nodes are grouped by the
                            region recorded in each hero file; clusters are a reading aid, not a political map.
                        </p>
                        <dl className="mt-3 space-y-1.5">
                            {RELATION_TYPES.map((type) => (
                                <div key={type} className="flex items-start gap-2">
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 shrink-0"
                                        style={{ backgroundColor: RELATION_META[type].color }}
                                    />
                                    <div>
                                        <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-fg">
                                            {RELATION_META[type].label}
                                        </dt>
                                        <dd className="text-[11px] leading-snug text-faint">
                                            {RELATION_META[type].description}
                                        </dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                <div className="border border-line bg-elevated px-4 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                        {edges.length} sourced links · {nodes.length} connected heroes
                    </p>
                </div>
            </aside>
        </div>
    );
}
