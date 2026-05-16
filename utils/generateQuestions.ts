export const generateQuestions = (match: any) => {
    const home = match.homeTeam.name;
    const away = match.awayTeam.name;

    const q = [
        // MATCH RESULT
        `Will ${home} win the match?`,
        `Will ${away} win the match?`,
        `Will the match end in a draw?`,
        `Will ${home} win both halves?`,
        `Will ${away} win both halves?`,
        `Will either team come from behind to win?`,

        // GOALS
        `Will ${home} score over 1.5 goals?`,
        `Will ${home} score over 2.5 goals?`,
        `Will ${away} score over 1.5 goals?`,
        `Will ${away} score over 2.5 goals?`,
        `Will both teams score?`,
        `Will both teams NOT score?`,
        `Will there be over 1.5 goals?`,
        `Will there be over 2.5 goals?`,
        `Will there be over 3.5 goals?`,
        `Will there be over 4.5 goals?`,
        `Will there be under 2.5 goals?`,
        `Will either team score 3+ goals?`,
        `Will either team score 4+ goals?`,
        `Will both teams score in both halves?`,
        `Will there be goals in both halves?`,
        `Will the match end 0-0?`,

        // FIRST GOALS
        `Will ${home} score first?`,
        `Will ${away} score first?`,
        `Will the first goal come before 15 minutes?`,
        `Will the first goal come before 30 minutes?`,
        `Will there be a goal in the first 10 minutes?`,
        `Will there be a late goal after 85 minutes?`,

        // HALF TIME
        `Will ${home} lead at halftime?`,
        `Will ${away} lead at halftime?`,
        `Will the first half end in a draw?`,
        `Will there be a first half goal?`,
        `Will there be a second half goal?`,
        `Will the match have a 0-0 halftime score?`,
        `Will both teams score in the first half?`,
        `Will both teams score in the second half?`,

        // CLEAN SHEETS
        `Will ${home} keep a clean sheet?`,
        `Will ${away} keep a clean sheet?`,

        // CARDS / PENALTIES
        `Will there be a red card?`,
        `Will there be more than 5 yellow cards?`,
        `Will there be a penalty?`,
        `Will a penalty be missed?`,

        // CORNERS
        `Will there be more than 10 corners?`,
        `Will there be less than 10 corners?`,
        `Will there be more than 12 corners?`,
        `Will ${home} win more corners?`,
        `Will ${away} win more corners?`,

        // SPECIAL EVENTS
        `Will there be a hat-trick?`,
        `Will there be an own goal?`,
        `Will there be a comeback win?`,
        `Will the match go to extra time?`,
        `Will the match go to penalties?`,
        `Will a substitute score a goal?`,
        `Will VAR overturn a goal decision?`,
        `Will there be a disallowed goal?`,

        // ADVANCED
        `Will ${home} have more possession?`,
        `Will ${away} have more shots on target?`,
        `Will both goalkeepers make 3+ saves?`,
        `Will the match end with exactly 2 goals?`,
        `Will the match end with exactly 3 goals?`,
        `Will either team fail to register a shot on target?`,
    ];

    return q;
};



export const generateTeamQuestions = (team: any) => {
    const name = team.name;

    return [
        `Will ${name} finish in the top 3 this season?`,
        `Will ${name} finish in the top 4 this season?`,
        `Will ${name} finish in the bottom half this season?`,
        `Will ${name} avoid relegation this season?`,
        `Will ${name} get relegated this season?`,

        `Will ${name} win any trophy this season?`,
        `Will ${name} win the league this season?`,
        `Will ${name} win a domestic cup this season?`,
        `Will ${name} reach the final of a major competition this season?`,
        `Will ${name} qualify for the Champions League next season?`,

        `Will ${name} score over 70 goals this season?`,
        `Will ${name} score over 100 goals this season?`,
        `Will ${name} concede less than 40 goals this season?`,
        `Will ${name} keep over 15 clean sheets this season?`,
        `Will ${name} score in every remaining match this season?`,

        `Will ${name} go unbeaten for 10 consecutive matches this season?`,
        `Will ${name} have a winning streak of 5 matches this season?`,
        `Will ${name} beat their biggest rival this season?`,
        `Will ${name} finish above their biggest rival this season?`,
        `Will ${name} remain unbeaten at home this season?`,

        `Will ${name} sack their manager before the season ends?`,
        `Will ${name} appoint a new manager this season?`,
        `Will ${name} break their transfer record this summer?`,
        `Will ${name} sign a world-class player this summer?`,
        `Will ${name} sign Lionel Messi this summer?`,
        `Will ${name} sign a striker this transfer window?`,
        `Will ${name} sell their captain this summer?`,

        `Will ${name} produce the league’s top scorer this season?`,
        `Will ${name} have the best defense in the league this season?`,
        `Will ${name} have the highest scoring attack this season?`,
        `Will ${name} have a player win Player of the Season?`,
        `Will ${name} have more than 3 players score 10+ goals this season?`,

        `Will ${name} qualify for European competition next season?`,
        `Will ${name} reach the Champions League semi-final this season?`,
        `Will ${name} win an away match against a top 6 side this season?`,
        `Will ${name} lose fewer than 5 league matches this season?`,
        `Will ${name} end the season with over 80 points?`,
    ];
};


export const generatePlayerQuestions = (player: any) => {
    const name = player?.name;

    if (!name) return [];

    return [
        // ================= MATCH PERFORMANCE =================
        `Will ${name} score in their next match?`,
        `Will ${name} provide an assist in their next match?`,
        `Will ${name} score or assist in their next game?`,
        `Will ${name} play 90 minutes in their next match?`,
        `Will ${name} be substituted before 60 minutes?`,

        // ================= GOALS =================
        `Will ${name} score 2 or more goals in a single match this season?`,
        `Will ${name} score a hat-trick this season?`,
        `Will ${name} score from outside the box this season?`,
        `Will ${name} score a penalty this season?`,
        `Will ${name} score in back-to-back matches?`,

        // ================= ASSISTS =================
        `Will ${name} get 10+ assists this season?`,
        `Will ${name} provide more assists than goals this season?`,
        `Will ${name} record an assist in their next match?`,
        `Will ${name} reach 20+ goal contributions this season?`,

        // ================= PERFORMANCE =================
        `Will ${name} take 3+ shots on target in a match?`,
        `Will ${name} create 3+ chances in their next game?`,
        `Will ${name} complete 50+ passes in a match?`,
        `Will ${name} win Man of the Match this season?`,

        // ================= SEASON OUTCOMES =================
        `Will ${name} score over 15 goals this season?`,
        `Will ${name} finish the season with 20+ goals?`,
        `Will ${name} be nominated for Player of the Season?`,
        `Will ${name} win a trophy with their club this season?`,
        `Will ${name} finish as top scorer in their league?`,

        // ================= TRANSFER / CAREER =================
        `Will ${name} transfer to another club this summer?`,
        `Will ${name} join a top 5 European club next season?`,
        `Will ${name} increase their market value this year?`,
    ];
};

