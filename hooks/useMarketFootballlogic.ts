




import { generateQuestions } from "@/utils/generateQuestions";
import { format, isToday, isTomorrow } from "date-fns";
import { useState } from "react";

export function useMarketLogic(values: any, setValues: any) {

    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [questions, setQuestions] = useState<string[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    const update = (key: string, value: any) => {
        setValues({ ...values, [key]: value });
    };

   
    const selectMatch = (m: any) => {
        if (!m?.homeTeam || !m?.awayTeam) return;

        setSelectedMatch(m);

        update("match", m);
        update("startTime", m.startTime);
        update("endTime", m.endTime);

        setQuestions(generateQuestions(m));
    };

    const groupedMatches = (matches: any[]) => {
        return Object.entries(
            matches.reduce((acc: any, match: any) => {
                if (!match?.startTime) return acc;

                const date = new Date(match.startTime);

                let label = format(date, "MMMM d, yyyy");

                if (isToday(date)) label = "Today";
                else if (isTomorrow(date)) label = "Tomorrow";

                if (!acc[label]) acc[label] = [];

                acc[label].push(match);
                return acc;
            }, {})
        );
    };

    return {
        selectedMatch,
        setSelectedMatch,
        selectedTeam,
        setSelectedTeam,
        questions,
        setQuestions,
        selectedQuestion,
        setSelectedQuestion,
        update,
        selectMatch,
        groupedMatches,
        generateQuestions,
    };
}