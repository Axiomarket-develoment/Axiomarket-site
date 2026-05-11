"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import CategorySection from "./CategorySection";
import QuestionBuilder from "./QuestionBuilder";
import TimingSection from "./TimingSection";
import OutcomesSection from "./OutcomesSection";

import { TEMPLATES } from "@/data/Template";
import { Template } from "@/data/market";
import { useMarketLogic } from "@/hooks/useMarketLogic";
import ImageUploader from "./ImageUploader";
import FootballQuestionBuilder from "./FootballQuestionBuilder";

// ---------------- TYPES ----------------

type Category = "Crypto" | "Meme Coins" | "Football" | "X";

interface SubmitData {
    category: Category;
    question: string;
    values: Record<string, any>;
    template: Template | null;
    startDate: Date;
    endDate: Date;
    outcomes: any[];
    durationMinutes: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SubmitData) => void;
}

// ---------------- COMPONENT ----------------

const CreateMarket = ({ open, onClose, onSubmit }: Props) => {
    const {
        category,
        setCategory,
        template,
        setTemplate,
        values,
        setValues,

        startDate,
        setStartDate,
        startTime,
        setStartTime,
        endDate,
        endTime,

        outcomes,
        setOutcomes,

        handleSubmit
    } = useMarketLogic(onSubmit);

    const [showTemplates, setShowTemplates] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const isFootball = category === "Football";

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        className="fixed inset-0  bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        className="fixed bottom-0 pt-24 left-0 right-0 z-50 bg-[#050505] rounded-t-3xl p-3 h-[90dvh] overflow-y-auto"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                    >
                        {/* CATEGORY */}
                        <CategorySection
                            category={category}
                            setCategory={setCategory}
                            setTemplate={setTemplate}
                            setValues={setValues}
                        />

                        {/* QUESTION */}
                        {!isFootball ? (
                            <QuestionBuilder
                                template={template}
                                setTemplate={setTemplate}
                                values={values}
                                setValues={setValues}
                                category={category}
                                templates={TEMPLATES[category] ?? []}
                                showTemplates={showTemplates}
                                setShowTemplates={setShowTemplates}
                            />
                        ) : (
                            <FootballQuestionBuilder
                                values={values}
                                setValues={setValues}
                            />
                        )}

                        {/* TIMING */}
                        <TimingSection
                            startDate={startDate}
                            startTime={startTime}
                            endDate={endDate}
                            endTime={endTime}
                            setStartDate={setStartDate}
                            setStartTime={setStartTime}
                        />

                        {/* IMAGE (disabled for Football + X if you want later rule) */}
                        {!isFootball && (
                            <ImageUploader
                                imagePreview={imagePreview}
                                setImagePreview={setImagePreview}
                                setValues={setValues}
                            />
                        )}

                        {/* OUTCOMES */}
                        <OutcomesSection
                            outcomes={outcomes}
                            setOutcomes={setOutcomes}
                        />

                        {/* SUBMIT */}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 mt-10 bg-[#FF394A] rounded-full text-white"
                        >
                            Create Market
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateMarket;