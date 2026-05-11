"use client";

import { useState } from "react";

import { type Style } from "@/data/styles";
import StyleSelector from "./StyleSelector";
import MatchSelector from "./MatchSelector";
import TeamSelector from "./TeamSelector";
import QuestionList from "./QuestionList";
import SelectedPreview from "./SelectedPreview";
import { generateQuestions } from "@/utils/generateQuestions";
import { useFootballData } from "@/hooks/useFootballData";


export default function FootballQuestionBuilder({
    values,
    setValues,
}: any) {

    const { matches, teams } = useFootballData();
    const [style, setStyle] = useState<Style>("");

    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);

    const [questions, setQuestions] = useState<string[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    const update = (key: string, value: any) => {
        setValues({ ...values, [key]: value });
    };

    // ================= MATCH HANDLER =================
    const handleSelectMatch = (match: any) => {
        if (!match) return;

        setSelectedMatch(match);

        update("match", match);
        update("startTime", match.startTime);
        update("endTime", match.endTime);

        const qs = generateQuestions(match);
        setQuestions(qs);

        setSelectedQuestion(null);
    };

    // ================= TEAM HANDLER =================
    const handleSelectTeam = (team: any) => {
        if (!team) return;

        setSelectedTeam(team);

        update("team", team);

        setSelectedQuestion(null);
        setQuestions([]); // optional: clear match questions when switching to team mode
    };

    return (
        <div className="mt-4">

            <StyleSelector
                style={style}
                setStyle={setStyle}
            />

            {/* ================= MATCH MODE ================= */}
            {style === "Match" && (
                <MatchSelector
                    matches={matches}
                    selectedMatch={selectedMatch}
                    setSelectedMatch={handleSelectMatch}
                    setQuestions={setQuestions}
                    update={update}
                />
            )}

            {/* ================= TEAM MODE ================= */}
            {style === "Team" && (
                <TeamSelector
                    selectedTeam={selectedTeam}
                    setSelectedTeam={handleSelectTeam}
                    update={update}
                    teams={teams}
                />
            )}

            {/* ================= PREVIEW ================= */}
            {selectedMatch && (
                <SelectedPreview match={selectedMatch} mode="Match" />
            )}

            {
                selectedTeam && (
                    <SelectedPreview team={selectedTeam} mode="Team" />
                )
            }

            {/* ================= QUESTIONS ================= */}
            {questions.length > 0 && (
                <QuestionList
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    setSelectedQuestion={setSelectedQuestion}
                    update={update}
                />
            )}

        </div>
    );
}