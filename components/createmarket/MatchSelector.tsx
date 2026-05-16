"use client";

import { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { generateQuestions } from "@/utils/generateQuestions";


export default function MatchSelector({
    matches,
    selectedMatch,
    setSelectedMatch,
    setQuestions,
    update,
}: any) {

    const [openMatch, setOpenMatch] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);



    const groupedMatches = Object.entries(
        matches.reduce((acc: any, match: any) => {

            const date = new Date(match.startTime);

            let label = format(date, "MMMM d, yyyy");
            if (isToday(date)) label = "Today";
            else if (isTomorrow(date)) label = "Tomorrow";

            if (!acc[label]) acc[label] = [];
            acc[label].push(match);

            return acc;
        }, {})
    );

    const selectMatch = (m: any) => {

        setSelectedMatch(m);

        update("match", m);
        update("startTime", m.startTime);
        update("endTime", m.endTime);
        update("matchDate", m.startTime);

        setQuestions(generateQuestions(m));

        setOpenMatch(false);
    };

    return (
        <div className="mb-3 relative" ref={dropdownRef}>

            <label className="text-[#8B8B8B] text-sm mb-2 block">
                Select Match
            </label>

            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMatch(!openMatch);
                }}
                className="w-full p-3 text-sm bg-[#0A0A0B] border border-[#1B1B1B] text-white rounded-xl cursor-pointer flex justify-between items-center hover:border-[#2a2a2a] transition"
            >
                <div className="flex items-center gap-2">

                    {selectedMatch ? (
                        <>
                            {/* HOME TEAM */}
                            <img
                                src={selectedMatch.homeTeam?.logo || "/placeholder.png"}
                                className="w-5 h-5 rounded-full"
                                alt={selectedMatch.homeTeam?.name}
                            />

                            <span className="text-white text-sm truncate max-w-[160px]">
                                {selectedMatch.homeTeam?.name}
                            </span>

                            <span className="text-[#555] text-xs mx-1">vs</span>

                            {/* AWAY TEAM */}
                            <span className="text-white text-sm truncate max-w-[160px]">
                                {selectedMatch.awayTeam?.name}
                            </span>

                            <img
                                src={selectedMatch.awayTeam?.logo || "/placeholder.png"}
                                className="w-5 h-5 rounded-full"
                                alt={selectedMatch.awayTeam?.name}
                            />
                        </>
                    ) : (
                        <span>Select match</span>
                    )}
                </div>

                <span className={`text-[#8B8B8B] text-[10px] transition-transform duration-200 ${openMatch ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </div>

            <AnimatePresence>
                {openMatch && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute w-full mt-2 bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl shadow-lg z-50 max-h-[350px] overflow-y-auto"
                    >

                        {groupedMatches.map(([date, dayMatches]: any) => (
                            <div key={date}>

                                <div className="px-4 flex items-center py-2 gap-2 text-[11px] font-semibold text-[#666] sticky top-0">
                                    <div className="w-full h-px bg-white/10" />
                                    <div className="text-nowrap">{date}</div>
                                    <div className="w-full h-px bg-white/10" />
                                </div>

                                {dayMatches.map((m: any) => (
                                    <div
                                        key={m.slug}
                                        onClick={() => selectMatch(m)}
                                        className="px-4 py-3 cursor-pointer text-sm text-[#8B8B8B] hover:bg-[#141414] hover:text-white"
                                    >
                                        <div className="flex items-center justify-between gap-2">

                                            <div className="flex items-center gap-2 w-[45%]">
                                                <img
                                                    src={m.homeTeam?.logo || "/placeholder.png"}
                                                    className="w-5 h-5 rounded-full"
                                                />
                                                <span className="truncate">
                                                    {m.homeTeam?.name || "Unknown Team"}
                                                </span>
                                            </div>

                                            <div className="w-[10%] flex justify-center text-[10px] text-[#555]">
                                                VS
                                            </div>

                                            <div className="flex items-center gap-2 w-[45%] justify-end">
                                                <span className="truncate">
                                                    {m.awayTeam?.name || "Unknown Team"}
                                                </span>

                                                <img
                                                    src={m.awayTeam?.logo || "/placeholder.png"}
                                                    className="w-5 h-5 rounded-full"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        ))}

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}