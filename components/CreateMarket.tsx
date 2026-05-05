"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InlineBuilder from "./InlineBuilder";
import CategorySelect from "./CategorySelect";
import toast from "react-hot-toast";
import { TEMPLATES } from "@/data/Template";
import { createPortal } from "react-dom";
import { Template } from "@/data/market";

// ---------------- TYPES ----------------

type FieldType = "text" | "number" | "select" | "time";

interface Field {
    key: string;
    type: FieldType;
    placeholder?: string;
    options?: string[];
}



type Category =
    | "Crypto"
    | "Meme Coins"
    | "Sports"
    | "Stocks"
    | "X"
    | "Politics"
    | "Entertainment";



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

const MARKET_TYPES: Category[] = [
    "Crypto",
    "Meme Coins",
    "Sports",
    "Stocks",
    "X",
    "Politics",
    "Entertainment",
];


const getDurationEnd = (now: Date, value: string) => {
    if (typeof value !== "string") return new Date(now);

    const v = value.toLowerCase();
    const end = new Date(now);

    if (v.includes("1h") || v.includes("1 hour")) {
        end.setHours(end.getHours() + 1);
    }

    if (v.includes("24h") || v.includes("24 hours")) {
        end.setHours(end.getHours() + 24);
    }

    if (v.includes("7d") || v.includes("7 days")) {
        end.setDate(end.getDate() + 7);
    }

    return end;
};


const CreateMarket = ({ open, onClose, onSubmit }: Props) => {
    const [category, setCategory] = useState<Category>("X");
    const [template, setTemplate] = useState<Template | null>(null);
    const [values, setValues] = useState<Record<string, any>>({});

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [showTemplates, setShowTemplates] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [outcomes, setOutcomes] = useState([
        { label: "Yes" },
        { label: "No" },
    ]);

    const getDurationFromPhrase = (phrase: string) => {
        const now = new Date();

        switch (phrase) {
            case "1h":
                return 60 * 60 * 1000;
            case "24h":
                return 24 * 60 * 60 * 1000;
            case "7d":
                return 7 * 24 * 60 * 60 * 1000;
            default:
                return 0;
        }
    };

    const computeSchedule = () => {
        const start = new Date(`${startDate}T${startTime}`);
        const durationMs = getDurationFromPhrase(values.timePhrase || "");
        const end = new Date(start.getTime() + durationMs);

        return { start, end };
    };

    const { start, end } = computeSchedule();

    // Handle image preview //

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;

            setImagePreview(result);

            setValues((prev) => ({
                ...prev,
                image: file, // actual file (for upload later)
                imagePreview: result, // base64 preview
            }));
        };

        reader.readAsDataURL(file);
    };
    const removeImage = () => {
        setImagePreview(null);

        setValues((prev) => {
            const copy = { ...prev };
            delete copy.image;
            delete copy.imagePreview;
            return copy;
        });
    };

    const computeStartEnd = () => {
        const start = new Date(`${startDate}T${startTime}`);
        const durationMs = getDurationFromPhrase(values.timePhrase);

        const end = new Date(start.getTime() + durationMs);

        return { start, end };
    };

    const durationMs = getDurationFromPhrase(values.timePhrase || "");

    // ----------------OPTIOS SETTINGS -----------------//

    const addOutcome = () => {
        setOutcomes((prev) => [...prev, { label: "" }]);
    };

    const updateOutcome = (index: number, value: string) => {
        setOutcomes((prev) =>
            prev.map((o, i) =>
                i === index ? { ...o, label: value } : o
            )
        );
    };

    const removeOutcome = (index: number) => {
        setOutcomes((prev) => prev.filter((_, i) => i !== index));
    };

    // ---------------- BUILD QUESTION ----------------

    const buildQuestion = () => {
        if (!template) return "";

        return template.template.replace(/\{(.*?)\}/g, (_, key) => {
            return values[key] || `{${key}}`;
        });
    };


    // ---------------- TIME AUTO SYNC ----------------

    useEffect(() => {
        if (!values.timePhrase) return;

        const now = new Date();
        const end = getDurationEnd(now, values.timePhrase);

        const formatDate = (d: Date) => d.toLocaleDateString("en-CA");
        const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

        setStartDate(formatDate(now));
        setStartTime(formatTime(now));

        setEndDate(formatDate(end));
        setEndTime(formatTime(end));
    }, [values.timePhrase]);

    useEffect(() => {
        if (!values.timePhrase) return;
        if (!startDate || !startTime) return;

        const start = new Date(`${startDate}T${startTime}`);
        const durationMs = getDurationFromPhrase(values.timePhrase);

        if (!durationMs) return;

        const newEnd = new Date(start.getTime() + durationMs);

        const formatDate = (d: Date) => d.toLocaleDateString("en-CA");
        const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

        setEndDate(formatDate(newEnd));
        setEndTime(formatTime(newEnd));
    }, [startDate, startTime, values.timePhrase]);


    // ---------------- SUBMIT ----------------

    const handleSubmit = () => {
        if (!template) {
            toast.error("Please select a template");
            return;
        }

        if (!startDate || !startTime || !endDate || !endTime) {
            toast.error("Please fill all date and time fields");
            return;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
            toast.error("End time must be after start time");
            return;
        }

        const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);

        const question = buildQuestion();

        const formattedOutcomes = outcomes.map((o) => ({
            label: o.label,
            result: null,
            odds: 2.0,
            liquidity: 0,
            volume: 0,
            count: 0,
            pool: 0,
            percentage: 50,
        }));

        onSubmit({
            category,
            question,
            values,
            template,
            startDate: start,
            endDate: end,
            outcomes: formattedOutcomes,
            durationMinutes, // ✅ FIXED
        });
    };


    const handleFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;

            setImagePreview(result);

            setValues((prev) => ({
                ...prev,
                image: file,
                imagePreview: result,
            }));
        };

        reader.readAsDataURL(file);
    };
    // ---------------- UI ----------------

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
                        className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505] rounded-t-3xl p-3 h-[80vh] overflow-y-auto"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                    >
                        {/* CATEGORY */}
                        <CategorySelect
                            MARKET_TYPES={MARKET_TYPES}
                            category={category}
                            setCategory={setCategory}
                            setTemplate={setTemplate}
                            setValues={setValues}
                        />



                        {/* QUESTION BUILDER */}


                        <div className="mb-2 text-[#E4E4E4] text-sm">Question</div>

                        {/* QUESTION HEADER */}
                        <div className="mb-2 text-[#E4E4E4] bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl px-2 py-4 text-sm flex items-start justify-between overflow-x-auto gap-2 custom-scrollbar">
                            {/* INLINE BUILDER (kept exactly as-is) */}
                            <InlineBuilder
                                template={template}
                                values={values}
                                setValues={setValues}
                                category={category}
                            />

                            {/* TOGGLE BUTTON */}
                            <button
                                onClick={() => setShowTemplates((prev) => !prev)}
                                className="text-[#8B8B8B] text-[10px] items-center self-center"
                            >
                                {showTemplates ? "▲" : "▼"}
                            </button>
                        </div>
                        <AnimatePresence>
                            {showTemplates && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden border border-[#222] rounded-md mt-2"
                                >
                                    {TEMPLATES[category]?.map((t: Template) => (
                                        <div
                                            key={t.label}
                                            onClick={() => {
                                                setTemplate(t);
                                                setValues({});
                                                setShowTemplates(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer text-sm hover:bg-[#111]
                        ${template?.label === t.label
                                                    ? "text-[#FF394A]"
                                                    : "text-[#8B8B8B]"
                                                }`}
                                        >
                                            {t.template}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* TIMING */}
                        <div className="mt-5">
                            <div className="text-[#E4E4E4] text-sm mb-2">Timing</div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex flex-col gap-1 mb-2">

                                    <label htmlFor="start-date">Start Date</label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="input border-[#222] text-[#8B8B8B]  placeholder:text-[#8B8B8B] text-sm placeholder:text-sm border py-3 px-2 rounded-md my-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 mb-2">

                                    <label htmlFor="start-time">Start Time</label>
                                    <input
                                        type="time"
                                        id="start-time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="input border-[#222] text-[#8B8B8B]  placeholder:text-[#8B8B8B] text-sm placeholder:text-sm border py-3 px-2 rounded-md my-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 mb-2">
                                    <label htmlFor="end-date">End Date</label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        value={endDate}
                                        readOnly
                                        className="input border-[#222] text-[#8B8B8B] bg-[#0A0A0B] text-sm border py-3 px-2 rounded-md my-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 mb-2">

                                    <label htmlFor="end-time">End Time</label>
                                    <input
                                        type="time"
                                        id="end-time"
                                        value={endTime}
                                        readOnly
                                        className="input border-[#222] text-[#8B8B8B] bg-[#0A0A0B] text-sm border py-3 px-2 rounded-md my-1"
                                    />
                                </div>
                            </div>
                        </div>




                        {/* IMAGE (hidden for Sports & X) */}
                        {category !== "Sports" && category !== "X" && (
                            <div
                                onClick={() => document.getElementById("imageUpload")?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleFile(file);
                                }}
                                className="w-full h-60 border border-dashed border-[#333] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#FF394A] transition"
                            >
                                {/* UPLOAD ICON */}
                                <div className="mb-2 text-[#8B8B8B]">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>

                                <p className="text-[#8B8B8B] text-sm">
                                    Click or drag image here
                                </p>

                                <p className="text-xs text-[#555] mt-1">
                                    PNG, JPG, WEBP supported
                                </p>

                                {/* hidden input */}
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFile(file);
                                    }}
                                />
                            </div>
                        )}



                        {/* OUTCOMES */}
                        <div className="mt-6">
                            <div className="text-[#E4E4E4]  text-sm mb-2">
                                Outcomes
                            </div>

                            <div className="flex w-full   gap-2">
                                {outcomes.map((opt, idx) => (
                                    <div key={idx} className="flex w-full  gap-2 items-center">
                                        <input
                                            type="text"
                                            value={opt.label}
                                            placeholder="Outcome label"
                                            onChange={(e) =>
                                                updateOutcome(idx, e.target.value)
                                            }
                                            className="input  text-[#8B8B8B] border-[#222] border py-2 px-2 rounded-md w-full"
                                        />

                                        {outcomes.length > 2 && (
                                            <button
                                                onClick={() => removeOutcome(idx)}
                                                className="text-red-400 text-sm"
                                            >
                                                remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* <button
                                onClick={addOutcome}
                                className="mt-3 text-sm text-[#FF394A]"
                            >
                                + Add outcome
                            </button> */}
                        </div>

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