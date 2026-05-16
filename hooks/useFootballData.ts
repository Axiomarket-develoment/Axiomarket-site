"use client";

import { apiRequest } from "@/utils/apiRequest";
import { useEffect, useState } from "react";

export function useFootballData() {

    const [matches, setMatches] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {

        const fetchMatches = async () => {

            const res = await apiRequest(
                "/user_match/get_matches",
                {
                    method: "GET",
                    showLoading: false,
                }
            );

            if (res.success) {
                setMatches(res.data?.data || []);
            }
        };

        const fetchTeams = async () => {

            const res = await apiRequest(
                "/user_match/get_teams",
                {
                    method: "GET",
                    showLoading: false,
                }
            );

            if (res.success) {
                setTeams(res.data?.data || []);
            }
        };

        const fetchPlayers = async () => {

            const res = await apiRequest(
                "/user_player/get_players",
                {
                    method: "GET",
                    showLoading: false,
                }
            );

            if (res.success) {
                setPlayers(res.data?.data || []);
            }
        };

        fetchMatches();
        fetchTeams();
        fetchPlayers();

    }, []);

    return {
        matches,
        teams,
        players
    };
}