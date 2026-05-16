
import { Template } from "@/data/market";

type Category =
    | "Crypto"
    | "Meme Coins"
    | "Football"
    //   | "Stocks"
    | "X"
//   | "Politics"
//   | "Entertainment";


export const TEMPLATES: Partial<Record<Category, Template[]>> = {
    X: [
        {
            label: "Tweet Count",
            template: "Will {name} make more than {number} tweets in {timePhrase}?",
            fields: [
                { key: "name", type: "text", placeholder: "@username" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 1 Hour", value: "1h" },
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" },
                        { label: "Tomorrow", value: "tomorrow" },
                        { label: "This Week", value: "week" }
                    ]
                }
            ]
        },

        {
            label: "Follower Gain",
            template: "Will {name} gain more than {number} followers in {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 1 Hour", value: "1h" },
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" },
                        { label: "Tomorrow", value: "tomorrow" }
                    ]
                }
            ]
        },

        {
            label: "Viral Tweet",
            template: "Will {name} get more than {number} likes on a tweet in {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 1 Hour", value: "1h" },
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" }
                    ]
                }
            ]
        },

        {
            label: "Post Activity",
            template: "Will {name} post in {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "Today", value: "today" },
                        { label: "Tomorrow", value: "tomorrow" },
                        { label: "This Week", value: "week" }
                    ]
                }
            ]
        },

        {
            label: "Reply Count",
            template: "Will {name} make more than {number} replies in {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 1 Hour", value: "1h" },
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" }
                    ]
                }
            ]
        },
        {
            label: "Engagement Spike",
            template: "Will {name} get more than {number} total engagements on a tweet in {timePhrase}?",
            fields: [
                { key: "name", type: "text", placeholder: "@username" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 1 Hour", value: "1h" },
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" }
                    ]
                }
            ]
        },
        {
            label: "Viral Thread",
            template: "Will {name} post a thread that gets more than {number} likes {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                { key: "number", type: "number" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 24 Hours", value: "24h" },
                        { label: "In 7 Days", value: "7d" }
                    ]
                }
            ]
        },
        {
            label: "Verification Status",
            template: "Will {name} get verified on X in {timePhrase}?",
            fields: [
                { key: "name", type: "text" },
                {
                    key: "timePhrase",
                    type: "select",
                    options: [
                        { label: "In 7 Days", value: "7d" },
                        { label: "In 30 Days", value: "30d" },
                        { label: "This Month", value: "month" }
                    ]
                }
            ]
        }
    ],

    Crypto: [
        {
            label: "Price Above",

            template:
                "Will {assetSymbol} be above ${target} in {duration}?",

            fields: [
                {
                    key: "assetSymbol",
                    type: "text",
                },

                {
                    key: "target",
                    type: "number",
                },

                {
                    key: "duration",
                    type: "select",

                    options: [
                        "1 hour",
                        "24 hours",
                        "7 days",
                        "30 days",
                    ],
                },
            ],
        },

        {
            label: "Price Below",

            template:
                "Will {assetSymbol} fall below ${target} in {duration}?",

            fields: [
                {
                    key: "assetSymbol",
                    type: "text",
                },

                {
                    key: "target",
                    type: "number",
                },

                {
                    key: "duration",
                    type: "select",

                    options: [
                        "1 hour",
                        "24 hours",
                        "7 days",
                    ],
                },
            ],
        },
    ],

    "Meme Coins": [
        {
            label: "Meme Pump",

            template:
                "Will {assetSymbol} pump above ${target} in {duration}?",

            fields: [
                {
                    key: "assetSymbol",
                    type: "text",
                },

                {
                    key: "target",
                    type: "number",
                },

                {
                    key: "duration",
                    type: "select",

                    options: [
                        "1 hour",
                        "24 hours",
                        "7 days",
                    ],
                },
            ],
        },
    ],


};

export const SUGGESTIONS: Record<string, any> = {
    X: {
        name: [
            { label: "@0xmelissa19", value: "@0xmelissa19" },
            { label: "@web3rightous", value: "@web3rightous" },
            { label: "@_belikebaddy", value: "@_belikebaddy" },
            { label: "@kyennmark", value: "@kyennmark" },
            { label: "@wizarab10", value: "@wizarab10" },
            { label: "@cryptoMaliel", value: "@cryptoMaliel" },
            { label: "@uniqueKhaddy", value: "@uniqueKhaddy" },
            { label: "@masterdabozz", value: "@masterdabozz" },
            { label: "@utdkobi", value: "@utdkobi" },
            { label: "@utdfondre", value: "@utdfondre" },
            { label: "seskinho9", value: "seskinho9" },
            { label: "@utdmegish", value: "@utdmegish" },
        ],
        number: [
            { label: "1", value: "1" },
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "50", value: "50" },
        ],
    },

    Crypto: {
        token: [
            { label: "BTC", value: "BTC" },
            { label: "ETH", value: "ETH" },
            { label: "SOL", value: "SOL" },
        ],
        number: [
            { label: "1000", value: "1000" },
            { label: "5000", value: "5000" },
            { label: "10000", value: "10000" },
        ],
    },

    Sports: {
        team: [
            { label: "Arsenal", value: "Arsenal" },
            { label: "Man City", value: "Man City" },
            { label: "Real Madrid", value: "Real Madrid" },
        ],
    },
};
