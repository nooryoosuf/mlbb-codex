"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const staggerParent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export function Reveal({
    children,
    delay = 0,
    className = "",
    y = 20,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
    y?: number;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            variants={staggerParent}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div className={className} variants={fadeUp}>
            {children}
        </motion.div>
    );
}

export function SplitLines({
    lines,
    className = "",
    lineClassName = "",
}: {
    lines: ReactNode[];
    className?: string;
    lineClassName?: string;
}) {
    const reduce = useReducedMotion();
    return (
        <span className={className}>
            {lines.map((line, index) => (
                <span key={index} className="block overflow-hidden">
                    <motion.span
                        className={`block ${lineClassName}`}
                        initial={reduce ? false : { y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.8, delay: 0.1 + index * 0.08, ease: EASE }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
