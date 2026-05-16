"use client";

import { useState } from "react";

import StyleSelector from "./StyleSelector";
import MatchSelector from "./MatchSelector";
import TeamSelector from "./TeamSelector";
import QuestionList from "./QuestionList";
import SelectedPreview from "./SelectedPreview";
import {
    generatePlayerQuestions,
    generateQuestions,
    generateTeamQuestions
} from "@/utils/generateQuestions";
import { useFootballData } from "@/hooks/useFootballData";
import PlayerSelector from "./PlayerSelector";

export default function FootballQuestionBuilder({
    style,
    setStyle,
    values,
    setValues,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setOutcomes,
    marketContext,
    setMarketContext,
}: any) {

    const { matches, teams, players } = useFootballData();

    // ================= GLOBAL =================
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const [questions, setQuestions] = useState<string[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
    const [openQuestions, setOpenQuestions] = useState(true);
    const [outcomeType, setOutcomeType] = useState<string | null>(null);

    // ================= STYLE SCOPED STATE =================
    const [teamForMatch, setTeamForMatch] = useState<any>(null);
    const [matchForMatch, setMatchForMatch] = useState<any>(null);

    const [teamForOutcome, setTeamForOutcome] = useState<any>(null);
    const [matchForOutcome, setMatchForOutcome] = useState<any>(null);

    const [openPlayers, setOpenPlayers] = useState(true);


    const [teamForTeam, setTeamForTeam] = useState<any>(null);

    const update = (key: string, value: any) => {
        setValues((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const formatTime = (d: Date) =>
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0");

    const resetTiming = () => {
        setStartDate?.("");
        setStartTime?.("");
        setEndDate?.("");
        setEndTime?.("");
    };

    // ================= MATCH FILTER =================
    const getMatchesByTeam = (team: any) => {

        if (!team) return [];

        return matches.filter((m: any) => {
            return (
                m.homeTeam?.name?.toLowerCase() === team.name?.toLowerCase() ||
                m.awayTeam?.name?.toLowerCase() === team.name?.toLowerCase()
            );
        });
    };

    // ================= MATCH SELECT =================
    const handleSelectMatch = (match: any, mode: "match" | "outcome") => {
        if (!match) return;

        update("match", match);

        const end = new Date(match.endTime);
        const start = new Date(match.startTime);

        // ================= MATCH MODE =================
        if (mode === "match") {
            setMatchForMatch(match);

            const home = match.homeTeam;
            const away = match.awayTeam;

            update("match", match);

            update("participants", [
                home?.name,
                away?.name
            ]);

            update("participantImages", [
                home?.logo,
                away?.logo
            ]);

            update("team", {
                home,
                away
            });

            update("teamName", `${home?.name} vs ${away?.name}`);

            setStartDate?.(formatDate(start));
            setStartTime?.(formatTime(start));
            setEndDate?.(formatDate(end));
            setEndTime?.(formatTime(end));

            setQuestions(generateQuestions(match));
            setOpenQuestions(true);
            setSelectedQuestion(null);

            return;
        }

        // ================= OUTCOME MODE =================
        // ================= OUTCOME MODE =================
        setMatchForOutcome(match);

        const home = match.homeTeam;
        const away = match.awayTeam;

        // 🔥 THIS IS THE MISSING PART
        update("match", match);

        update("participants", [
            home?.name,
            away?.name
        ]);

        update("participantImages", [
            home?.logo,
            away?.logo
        ]);

        update("team", {
            home,
            away
        });

        update("teamName", `${home?.name} vs ${away?.name}`);

        // keep timing
        setStartDate?.(formatDate(start));
        setStartTime?.(formatTime(start));
        setEndDate?.(formatDate(end));
        setEndTime?.(formatTime(end));

        // reset UI
        setQuestions([]);
        setSelectedQuestion(null);
        setOpenQuestions(false);
    };

    // ================= TEAM SELECT =================
    const handleSelectTeam = (team: any, mode: "match" | "outcome" | "team") => {
        if (!team) return;

        if (mode === "match") setTeamForMatch(team);
        if (mode === "outcome") setTeamForOutcome(team);
        if (mode === "team") setTeamForTeam(team);

        if (mode === "match") {
            setTeamForMatch(team);
            setMatchForMatch(null); // RESET OLD MATCH
        }

        if (mode === "outcome") {
            setTeamForOutcome(team);
            setMatchForOutcome(null); // RESET OLD MATCH
        }

        if (mode === "match") {
            setTeamForMatch(team);
            update("team", team);
            update("teamName", team.name);
            update("participants", [team.name]);
            update("participantImages", [team.logo]);
            update("league", team.league);
        }

        if (mode === "outcome") {
            setTeamForOutcome(team);
            update("team", team);
            update("teamName", team.name);
            update("participants", [team.name]);
            update("participantImages", [team.logo]);
            update("league", team.league);
        }

        if (mode === "team") {
            setTeamForTeam(team);
            update("team", team);
            update("teamName", team.name);
            update("participants", [team.name]);
            update("participantImages", [team.logo]);
            update("league", team.league);

            setQuestions(generateTeamQuestions(team));
        }


        if (mode === "team") {
            setQuestions(generateTeamQuestions(team));
        }

        setOpenQuestions(true);
    };

    // ================= PLAYER =================
    const handleSelectPlayer = (player: any) => {
        if (!player) return;

        setSelectedPlayer(player);

        update("player", player);
        update("playerName", player.name);
        update("playerImage", player.image);
        update("teamName", player.team?.name);
        update("participants", [player.name]);
        update("league", player.league);


        setQuestions(generatePlayerQuestions(player));
        setOpenQuestions(true);
    };

    const handleOutcomeChange = (type: string) => {
        setOutcomeType(type);

        if (type === "1X2") {
            setOutcomes?.([
                { code: "1", label: "Home" },
                { code: "X", label: "Draw" },
                { code: "2", label: "Away" },
            ]);
        }

        if (type === "DOUBLE_CHANCE") {
            setOutcomes?.([
                { code: "1X", label: "Home/Draw" },
                { code: "X2", label: "Draw/Away" },
                { code: "12", label: "Home/Away" },
            ]);
        }
    };

    return (
        <div className="mt-4">

            <StyleSelector
                style={style}
                setStyle={(newStyle: string) => {
                    setStyle(newStyle);

                    setTeamForMatch(null);
                    setTeamForOutcome(null);
                    setTeamForTeam(null);
                    setMatchForMatch(null);
                    setMatchForOutcome(null);

                    setQuestions([]);
                    setSelectedQuestion(null);

                    resetTiming();
                }}
            />

            {/* ================= OUTCOME ================= */}
            {style === "Outcome" && (
                <>
                    <div className="my-4 flex space-x-3">
                        <button
                            onClick={() => handleOutcomeChange("1X2")}
                            className={`w-full p-3 rounded-xl text-sm bg-[#0A0A0B] border
                                ${outcomeType === "1X2" ? "bg-[#FF394A] border-[#FF394A]" : "border-[#1B1B1B]"}`}
                        >
                            1X2
                        </button>

                        <button
                            onClick={() => handleOutcomeChange("DOUBLE_CHANCE")}
                            className={`w-full p-3 rounded-xl text-sm bg-[#0A0A0B] border
                                ${outcomeType === "DOUBLE_CHANCE" ? "bg-[#FF394A] border-[#FF394A]" : "border-[#1B1B1B]"}`}
                        >
                            Double Chance
                        </button>
                    </div>

                    {outcomeType && (
                        <>
                            <TeamSelector
                                selectedTeam={teamForOutcome}
                                setSelectedTeam={(t: any) => handleSelectTeam(t, "outcome")}
                                teams={teams}
                                update={update}
                            />

                            {teamForOutcome && (
                                <MatchSelector
                                    matches={getMatchesByTeam(teamForOutcome)}
                                    selectedMatch={matchForOutcome}
                                    setSelectedMatch={(m: any) => handleSelectMatch(m, "outcome")}
                                    setQuestions={setQuestions}
                                    update={update}
                                />
                            )}
                        </>
                    )}
                </>
            )}

            {/* ================= MATCH ================= */}
            {style === "Match" && (
                <>
                    <TeamSelector
                        selectedTeam={teamForMatch}
                        setSelectedTeam={(t: any) => handleSelectTeam(t, "match")}
                        teams={teams}
                        update={update}
                    />

                    {teamForMatch && (
                        <MatchSelector
                            matches={getMatchesByTeam(teamForMatch)}
                            selectedMatch={matchForMatch}
                            setSelectedMatch={(m: any) => handleSelectMatch(m, "match")}
                            setQuestions={setQuestions}
                            update={update}
                        />
                    )}
                </>
            )}

            {/* ================= TEAM ================= */}
            {style === "Team" && (
                <TeamSelector
                    selectedTeam={teamForTeam}
                    setSelectedTeam={(t: any) => handleSelectTeam(t, "team")}
                    teams={teams}
                    update={update}
                />
            )}

            {/* ================= PLAYER ================= */}
            {style === "Player" && (
                <PlayerSelector
                    players={players}
                    selectedPlayer={selectedPlayer}
                    setSelectedPlayer={handleSelectPlayer}
                    openPlayers={openPlayers}
                    setOpenPlayers={setOpenPlayers}
                />
            )}

            {/* ================= PREVIEW ================= */}
            {matchForMatch && (
                <SelectedPreview match={matchForMatch} mode="Match" />
            )}


            {matchForOutcome && style === "Outcome" && (
                <SelectedPreview match={matchForOutcome} mode="Match" />
            )}

            {teamForTeam && style === "Team" && (
                <SelectedPreview team={teamForTeam} mode="Team" />
            )}

            {selectedPlayer && (
                <SelectedPreview player={selectedPlayer} mode="Player" />
            )}

            {selectedQuestion && (
                <SelectedPreview
                    question={selectedQuestion}
                    mode="Question"
                />
            )}

            {/* ================= QUESTIONS ================= */}
            {questions.length > 0 && openQuestions && (
                <QuestionList
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    setSelectedQuestion={setSelectedQuestion}
                    update={update}
                    setOpenQuestions={setOpenQuestions}
                />
            )}
        </div>
    );
}