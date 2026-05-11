export const generateQuestions = (match: any) => {
    const home = match.homeTeam.name;
    const away = match.awayTeam.name;

    const q = [
        `Will ${home} win the match?`,
        `Will ${away} win the match?`,
        `Will the match end in a draw?`,

        `Will ${home} score over 1.5 goals?`,
        `Will ${home} score over 2.5 goals?`,
        `Will ${away} score over 1.5 goals?`,

        `Will both teams score?`,
        `Will both teams NOT score?`,

        `Will there be over 2.5 goals?`,
        `Will there be under 2.5 goals?`,
        `Will there be over 3.5 goals?`,
        `Will there be over 4.5 goals?`,

        `Will there be a red card?`,
        `Will there be a penalty?`,
        `Will there be a first half goal?`,
        `Will there be a second half goal?`,

        `Will ${home} score first?`,
        `Will ${away} score first?`,

        `Will ${home} keep a clean sheet?`,
        `Will ${away} keep a clean sheet?`,

        `Will there be more than 10 corners?`,
        `Will there be less than 10 corners?`,

        `Will the match go to extra time?`,
        `Will the match go to penalties?`,

        `Will either team score 3+ goals?`,
        `Will the first goal come before 30 minutes?`,

        `Will there be a hat-trick?`,
        `Will the match have 0–0 halftime?`,
        `Will both teams score in first half?`,
        `Will there be a comeback win?`
    ];

    return q;
};