"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Outcome {
    label: string;
}

interface Props {
    outcomes: Outcome[];
    setOutcomes: (o: Outcome[]) => void;
}

export default function OutcomesSection({
    outcomes,
    setOutcomes,
}: Props) {

    const handleChange = (index: number, value: string) => {
        const copy = [...outcomes];
        copy[index].label = value;
        setOutcomes(copy);
    };

    return (
        <div className="mt-6">

            <div className="text-[#E4E4E4] text-sm mb-3">
                Outcomes
            </div>

            <div className="flex gap-2">

                <AnimatePresence mode="popLayout">

                    {outcomes.map((opt, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                            className="w-full"
                        >

                            <input
                                type="text"
                                value={opt.label}
                                onChange={(e) =>
                                    handleChange(idx, e.target.value)
                                }
                                className="w-full text-sm py-2 px-3 rounded-md bg-[#0A0A0B] border border-[#222] text-[#8B8B8B] outline-none focus:border-[#333] transition"
                            />

                        </motion.div>
                    ))}

                </AnimatePresence>

            </div>
        </div>
    );
}