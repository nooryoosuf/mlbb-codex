"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black z-[9999] origin-bottom pointer-events-none"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <motion.div
                    className="absolute bottom-0 left-0 w-full h-2 bg-accent shadow-[0_0_40px_rgba(255,70,85,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            </motion.div>

            <motion.div
                className="fixed inset-0 bg-black z-[9999] origin-top pointer-events-none"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <motion.div
                    className="absolute bottom-0 left-0 w-full h-2 bg-accent shadow-[0_0_40px_rgba(255,70,85,0.8)]"
                />
            </motion.div>
            {children}
        </>
    );
}
