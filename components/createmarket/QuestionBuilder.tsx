"use client";

import { useState } from "react";
import { Template } from "@/data/market";
import InlineBuilder from "./InlineBuilder";

interface Props {
    template: Template | null;
    setTemplate: (t: Template | null) => void;
    values: Record<string, any>;
    setValues: (v: any) => void;
    category: string;
    templates: Template[];
}

export default function QuestionBuilder({
    template,
    values,
    setValues,
    category,
    templates
}: Props) {
    const [showTemplates, setShowTemplates] = useState(false);

    return (
        <>
            <div className="mb-2 text-sm text-[#E4E4E4]">Question</div>

            <div className="bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl px-2 py-4 flex justify-between">
                <InlineBuilder
                    template={template}
                    values={values}
                    setValues={setValues}
                    category={category}
                />

                <button
                    onClick={() => setShowTemplates((p) => !p)}
                    className="text-[#8B8B8B] text-[10px]"
                >
                    {showTemplates ? "▲" : "▼"}
                </button>
            </div>

            {showTemplates && (
                <div className="border border-[#222] mt-2 rounded-md">
                    {templates.map((t) => (
                        <div
                            key={t.label}
                            onClick={() => {
                                setValues({});
                                setTemplate(t);
                                setShowTemplates(false);
                            }}
                            className="px-3 py-2 text-sm text-[#8B8B8B] hover:bg-[#111]"
                        >
                            {t.template}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}