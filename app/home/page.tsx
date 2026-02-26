"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Live", "Active", "Settling", "Settled"];

export default function HomePage() {
    const [activeTab, setActiveTab] = useState("Live");
    const [selected, setSelected] = useState<"YES" | "NO" | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0c0f14] px-6 pt-8 pb-24">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-black dark:text-white">
                        Markets
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                        Live
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-8 border-b border-gray-200 dark:border-gray-800">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative pb-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                            >
                                <span className={`transition-colors ${isActive ? "text-black dark:text-white" : ""}`}>
                                    {tab}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="tabIndicator"
                                        className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-red-600"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Market List */}
                <div className="mt-8 space-y-5">
                    <AnimatePresence mode="wait">
                        {/* Wrap the card + actions in a single div */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Market Card */}
                            <motion.div
                                layout
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-[#11151c] p-6 rounded-xl border border-gray-200 dark:border-gray-800"
                            >
                                {/* Top */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-base font-semibold text-black dark:text-white">
                                            AVAX will reach $50 by March 30
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Expires in 3d 12h
                                        </p>
                                    </div>

                                    <span className="text-xs text-red-600 font-medium">
                                        LIVE
                                    </span>
                                </div>

                                {/* Probability Split (New Style) */}
                                <div className="mt-6">
                                    {/* Vertical Probability Split */}
                                    <div className="mt-6 flex h-20 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                        {/* YES side */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "100%" }}
                                            style={{ flexBasis: "65%" }}
                                            className="bg-red-600 text-white flex flex-col justify-center items-center"
                                        >
                                            <span className="text-sm opacity-90">YES</span>
                                            <span className="font-semibold text-lg mt-1">65%</span>
                                        </motion.div>

                                        {/* NO side */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "100%" }}
                                            style={{ flexBasis: "35%" }}
                                            className="bg-gray-200 dark:bg-gray-700 flex flex-col justify-center items-center"
                                        >
                                            <span className="text-sm text-gray-600 dark:text-gray-300">NO</span>
                                            <span className="font-semibold text-lg text-black dark:text-white mt-1">35%</span>
                                        </motion.div>
                                    </div>

                                    {/* Labels */}
                                    <div className="flex justify-between text-xs mt-2 text-gray-600 dark:text-gray-400">
                                        <span className="text-red-600 font-medium">YES 65%</span>
                                        <span className="text-gray-500 dark:text-gray-300">NO 35%</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between mt-6 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">Liquidity</p>
                                        <p className="font-medium text-black dark:text-white">
                                            320 AVAX
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Traders</p>
                                        <p className="font-medium text-black dark:text-white">
                                            42
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {activeTab === "Live" && (
                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className={`py-2.5 rounded-lg text-sm font-medium transition
                        ${selected === "YES" ? "bg-red-700 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}
                                            onClick={() => setSelected("YES")}
                                        >
                                            Yes
                                        </motion.button>

                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className={`py-2.5 rounded-lg border text-sm font-medium transition
                        ${selected === "NO" ? "border-red-600 text-red-600" : "border-gray-300 dark:border-gray-700 hover:border-red-600 hover:text-red-600"}`}
                                            onClick={() => setSelected("NO")}
                                        >
                                            No
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}