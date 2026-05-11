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

interface Props {
    match?: Match | null;
    team?: Team | null;
    mode?: "Match" | "Team";
}

export default function SelectedPreview({
    match,
    team,
    mode = "Match",
}: Props) {

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
                        />
                    )}

                    <span className="text-white text-sm">
                        {team.name}
                    </span>
                </div>
            </div>
        );
    }

    return null;
}