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
import ImageUploader from "./ImageUploader";
import FootballQuestionBuilder from "./FootballQuestionBuilder";
import { apiRequest } from "@/utils/apiRequest";
import { useMarketLogic } from "@/hooks/useMarketLogic";

// ---------------- TYPES ----------------

type Category =
    | "Crypto"
    | "Meme Coins"
    | "Football"
    | "X";

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
}

// ---------------- COMPONENT ----------------

const CreateMarket = ({
    open,
    onClose
}: Props) => {

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
        setEndDate,

        endTime,
        setEndTime,

        outcomes,
        setOutcomes,

        handleSubmit
    } = useMarketLogic();


    const [marketContext, setMarketContext] =
        useState<"MATCH" | "TEAM" | "PLAYER" | null>(null);

    const [showTemplates, setShowTemplates] =
        useState(false);

    const [style, setStyle] =
        useState("Match");

    const [loading, setLoading] =
        useState(false);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const isFootball =
        category === "Football";

    const isXl =
        category === "X";




    const resetForm = () => {

        setTemplate(null);

        setValues({});

        setStartDate("");

        setStartTime("");

        setEndDate("");

        setEndTime("");

        setOutcomes([
            { label: "Yes" },
            { label: "No" }
        ]);

        setImagePreview(null);

        setStyle("Match");

        setShowTemplates(false);
    };


    const handleCreateMarket = () => {
        const data = handleSubmit(style);
        submitMarket(data);
    };

    // -----------------------------------
    // SUBMIT MARKET
    // -----------------------------------

    const getMarketMode = (style: string) => {
    if (style === "Player") return "FOOTBALL_PLAYER";
    if (style === "Team") return "FOOTBALL_TEAM";
    if (style === "Outcome") return "FOOTBALL_OUTCOME";
    return "FOOTBALL_MATCH";
};

    const submitMarket = async (data: SubmitData) => {
        try {
            setLoading(true);

            const marketMode = getMarketMode(style);
            const response = await apiRequest("/user_market/user_market_creaiton",
                {
                    method: "POST",
                    body: {
                        category: data.category,
                        question: data.question,
                        marketMode,
                        values: data.values,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        outcomes: data.outcomes,
                        durationMinutes: data.durationMinutes,
                    },
                    showSuccess: true,
                });
            if (!response.success) { return; }
            console.log(response.data.market);
            // toast.success("Market created successfully");
            resetForm();
            onClose();
        }
        catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally { setLoading(false); }
    };

    // -----------------------------------
    // HANDLE CLICK
    // -----------------------------------

    console.log("OUTCOMES:", outcomes);

   

    return (
        <AnimatePresence>

            {open && (

                <>

                    {/* BACKDROP */}

                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
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
                                templates={
                                    TEMPLATES[category] ?? []
                                }
                                showTemplates={
                                    showTemplates
                                }
                                setShowTemplates={
                                    setShowTemplates
                                }
                            />

                        ) : (

                            <FootballQuestionBuilder
                                style={style}
                                setStyle={setStyle}
                                values={values}
                                setValues={setValues}
                                setStartDate={setStartDate}
                                setStartTime={setStartTime}
                                setEndDate={setEndDate}
                                setEndTime={setEndTime}
                                setOutcomes={setOutcomes}
                                marketContext={marketContext}
                                setMarketContext={setMarketContext}
                            />

                        )}

                        {/* TIMING */}

                        <TimingSection
                            style={style}
                            startDate={startDate}
                            startTime={startTime}
                            endDate={endDate}
                            endTime={endTime}
                            setStartDate={setStartDate}
                            setStartTime={setStartTime}
                            setEndDate={setEndDate}
                            setEndTime={setEndTime}
                        />

                        {/* IMAGE */}

                        {!isFootball && !isXl && (

                            <ImageUploader
                                imagePreview={imagePreview}
                                setImagePreview={
                                    setImagePreview
                                }
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
                            onClick={handleCreateMarket}
                            disabled={loading}
                            className="w-full py-3 mt-10 bg-[#FF394A] rounded-full text-white disabled:opacity-50"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Market"}
                        </button>

                    </motion.div>

                </>

            )}

        </AnimatePresence>
    );
};

export default CreateMarket;