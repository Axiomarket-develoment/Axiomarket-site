"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StyleSelector({
    style,
    setStyle,
}: any) {

    const [openStyle, setOpenStyle] = useState(false);

    const styles = ["Match", "Team", "Player"];

    return (
        <div className="mb-3 relative">

            <label className="text-[#E4E4E4] text-sm mb-2 block">
                Style
            </label>

            <div
                onClick={() => setOpenStyle(!openStyle)}
                className="w-full p-3 text-sm bg-[#0A0A0B] border border-[#1B1B1B] text-white rounded-xl cursor-pointer flex justify-between items-center hover:border-[#2a2a2a] transition"
            >
                <span>{style || "Select style"}</span>

                <span className={`text-[#8B8B8B] text-[10px] transition-transform duration-200 ${openStyle ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </div>

            <AnimatePresence>
                {openStyle && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute w-full mt-2 bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                        {styles.map((s) => (
                            <div
                                key={s}
                                onClick={() => {
                                    setStyle(s);
                                    setOpenStyle(false);
                                }}
                                className="px-4 py-3 cursor-pointer text-sm text-[#8B8B8B] hover:bg-[#141414] hover:text-white"
                            >
                                {s}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}