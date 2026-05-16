"use client";

import toast from "react-hot-toast";

interface Props {
    questions: string[];
    selectedQuestion: string | null;
    setSelectedQuestion: (q: string) => void;
    update: (key: string, value: any) => void;
    setOpenQuestions?: (v: boolean) => void;

}

export default function QuestionList({
    questions,
    selectedQuestion,
    setSelectedQuestion,
    update,
    setOpenQuestions
}: Props) {

const selectQuestion = (q: string) => {
    setSelectedQuestion(q);

    update("question", q);

    setOpenQuestions?.(false);

    toast.success("Question selected");
};

    return (
        <div className="mt-4">

            <div className="text-xs text-[#666] mb-2 uppercase">
                Possible Questions
            </div>

            <div className="space-y-2 border bg-[#0A0A0B] border-[#1B1B1B] rounded-xl max-h-[220px] overflow-y-auto">

                {questions.map((q, i) => (
                    <div
                        key={i}
                        onClick={() => selectQuestion(q)}
                        className={`p-2 text-sm cursor-pointer border-b border-[#1B1B1B]
                        ${selectedQuestion === q
                                ? "bg-[#141414] text-white"
                                : "text-[#8B8B8B] hover:bg-[#141414] hover:text-white"
                            }`}
                    >
                        {q}
                    </div>
                ))}
            </div>
        </div>
    );
}