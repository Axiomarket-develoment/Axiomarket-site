import { apiRequest } from "@/utils/apiRequest";
import { useEffect, useState } from "react";

export function useFootballData() {
    const [matches, setMatches] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        const fetchMatches = async () => {
            const res = await apiRequest("/user_match/get_matches", {
                method: "GET",
                showLoading: false,
            });

            if (res.success) setMatches(res.data?.data || []);
        };

        const fetchTeams = async () => {
            const res = await apiRequest("/user_match/get_teams", {
                method: "GET",
                showLoading: false,
            });

            if (res.success) setTeams(res.data?.data || []);
        };

        fetchMatches();
        fetchTeams();
    }, []);

    return { matches, teams };
}