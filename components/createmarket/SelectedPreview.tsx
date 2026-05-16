"use client";

import { format } from "date-fns";

interface Team {
    name: string;
    logo?: string;
}

interface Match {
    homeTeam: Team;
    awayTeam: Team;
    league: string;
    startTime: string;
}

interface Player {
    playerId: number;
    name: string;
    image: string;
    team: string;
    position?: string;
    nationality?: string;
    age?: number;
}

interface Props {
    match?: Match | null;
    team?: Team | null;
    question?: string | null;
    player?: Player | null;
    mode?: "Match" | "Team" | "Question" | "Player";
}

export default function SelectedPreview({
    match,
    team,
    question,
    player,
    mode = "Match",
}: Props) {

    // ================= PLAYER PREVIEW =================
    if (mode === "Player") {
        if (!player) return null;

        return (
            <div className="border border-[#222] bg-[#0A0A0B] rounded-xl p-4 mt-4">

                <div className="flex items-center gap-3">

                    <img
                        src={player.image}
                        alt={player.name}
                        className="w-16 h-16 rounded-full"
                    />

                    <div>

                        <div className="text-white font-semibold">
                            {player.name}
                        </div>

                        <div className="text-sm text-[#8B8B8B]">
                            {player.team}
                        </div>

                        <div className="text-xs text-[#666] mt-1">
                            {player.position}
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // ================= MATCH PREVIEW =================
    if (mode === "Match" && match) {
        return (
            <div className="mt-3 p-4 border border-[#222] bg-[#0A0A0B] rounded-xl text-sm text-[#8B8B8B]">

                <div className="text-[#E4E4E4] mb-3 text-xs uppercase tracking-wide">
                    Selected Match
                </div>

                <div className="flex items-center justify-between gap-3">

                    {/* HOME */}
                    <div className="flex items-center gap-2 w-[42%] justify-end text-right">

                        <span className="truncate text-white">
                            {match.homeTeam?.name}
                        </span>

                        {match.homeTeam?.logo && (
                            <img
                                src={match.homeTeam.logo}
                                className="w-6 h-6 rounded-full flex-shrink-0"
                                alt={match.homeTeam.name}
                            />
                        )}
                    </div>

                    {/* VS */}
                    <div className="w-[16%] flex flex-col items-center">
                        <span className="text-[10px] text-[#555] font-medium">
                            VS
                        </span>
                    </div>

                    {/* AWAY */}
                    <div className="flex items-center gap-2 w-[42%]">

                        {match.awayTeam?.logo && (
                            <img
                                src={match.awayTeam.logo}
                                className="w-6 h-6 rounded-full flex-shrink-0"
                                alt={match.awayTeam.name}
                            />
                        )}

                        <span className="truncate text-white">
                            {match.awayTeam?.name}
                        </span>
                    </div>

                </div>

                <div className="flex items-center justify-between mt-3">

                    <span className="text-[10px] text-[#444] mt-1">
                        {match.startTime &&
                            format(new Date(match.startTime), "h:mm a")}
                    </span>

                    <div className="mt-3 text-[11px] text-[#666] text-center">
                        {match.league}
                    </div>

                </div>

            </div>
        );
    }

    // ================= TEAM PREVIEW =================
    if (mode === "Team" && team) {
        return (
            <div className="mt-3 p-4 border border-[#222] bg-[#0A0A0B] rounded-xl text-sm text-[#8B8B8B]">

                <div className="text-[#E4E4E4] mb-3 text-xs uppercase tracking-wide">
                    Selected Team
                </div>

                <div className="flex items-center gap-3">

                    {team.logo && (
                        <img
                            src={team.logo}
                            className="w-8 h-8 rounded-full"
                            alt={team.name}
                        />
                    )}

                    <span className="text-white text-sm">
                        {team.name}
                    </span>

                </div>

            </div>
        );
    }

    // ================= QUESTION PREVIEW =================
    if (mode === "Question" && question) {
        return (
            <div className="mt-3 p-4 border border-[#222] bg-[#0A0A0B] rounded-xl text-sm text-[#8B8B8B]">

                <div className="text-[#E4E4E4] mb-3 text-xs uppercase tracking-wide">
                    Selected Question
                </div>

                <div className="text-white leading-relaxed">
                    {question}
                </div>

            </div>
        );
    }

    return null;
}