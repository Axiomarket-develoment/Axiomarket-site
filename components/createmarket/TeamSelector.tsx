"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Team {
    name: string;
    logo?: string;
}

interface Props {
    selectedTeam: Team | null;
    setSelectedTeam: (t: Team) => void;
    update: (key: string, value: any) => void;
    teams: Team[];
}

export default function TeamSelector({
    selectedTeam,
    setSelectedTeam,
    update,
    teams,
}: Props) {
    const selectTeam = (t: Team) => {
        setSelectedTeam(t);
        update("team", t);
    };

    return (
        <div className="mb-3 relative">

            <label className="text-[#8B8B8B] text-sm mb-2 block">
                Select Team
            </label>

            <div className="w-full p-3 text-sm bg-[#0A0A0B] border border-[#1B1B1B] text-white rounded-xl flex justify-between items-center">
                <span>
                    {selectedTeam ? selectedTeam.name : "Select team"}
                </span>
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-2 bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl overflow-hidden"
                >
                    {teams.map((t) => (
                        <div
                            key={t.name}
                            onClick={() => selectTeam(t)}
                            className="px-4 py-3 cursor-pointer text-sm text-[#8B8B8B] hover:bg-[#141414] hover:text-white flex items-center gap-2"
                        >
                            <img
                                src={t.logo || "/placeholder.png"}
                                className="w-5 h-5 rounded-full"
                            />
                            <span>{t.name}</span>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}