"use client";

import { Template } from "@/data/market";
import InlineBuilder from "./InlineBuilder";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
    template: Template | null;
    setTemplate: (t: Template | null) => void;

    values: Record<string, any>;
    setValues: (v: any) => void;

    category: string;
    templates: Template[];

    showTemplates: boolean;
    setShowTemplates: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuestionBuilder({
    template,
    values,
    setValues,
    setTemplate,
    category,
    templates,
    showTemplates,
    setShowTemplates
}: Props) {


    

    const handleToggle = () => {
        if (template) return; // 👈 block reopen after selection
        setShowTemplates((p) => !p);
    };

    return (
        <>
            <div className="mb-2 text-sm text-[#E4E4E4]">
                Question
            </div>

            {/* HEADER */}
            <div
                onClick={handleToggle}
                className="bg-[#0A0A0B] overflow-x-auto border border-[#1B1B1B] rounded-xl px-2 py-3 flex justify-between items-center cursor-pointer"
            >

                <InlineBuilder
                    template={template}
                    values={values}
                    setValues={setValues}
                    category={category}
                />

                {/* ARROW */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className="text-[#8B8B8B] text-[10px] ml-2"
                >
                    <motion.div
                        animate={{
                            rotate: showTemplates ? 180 : 0
                        }}
                        transition={{
                            duration: 0.2
                        }}
                    >
                        ▼
                    </motion.div>
                </button>

            </div>

            {/* TEMPLATE LIST */}
            <AnimatePresence>
                {showTemplates && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                            y: -5
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            y: -5
                        }}
                        transition={{
                            duration: 0.25
                        }}
                        className="border border-[#222] mt-2 rounded-md overflow-hidden"
                    >

                        {templates.map((t, index) => (

                            <motion.div
                                key={t.label}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: index * 0.03
                                }}
                                onClick={() => {
                                    setValues({});
                                    setTemplate(t);
                                    setShowTemplates(false);
                                }}
                                className="px-3 py-3 text-sm text-[#8B8B8B] hover:bg-[#111] cursor-pointer transition"
                            >
                                {t.template}
                            </motion.div>

                        ))}

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}