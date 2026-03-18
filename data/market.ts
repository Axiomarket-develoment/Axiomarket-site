export type MarketType = "CRYPTO" | "SOCIAL" | "SPORT";
export type MarketStatus = "PENDING" | "LIVE" | "ENDED" | "SETTLED";

export interface Option {
  label: string;
  liquidity: number;
  odds?: number;
  volume: number;
  count?: number;
  result?: boolean | null;
}

export interface Resolution {
  source?: string;
  method?: "ORACLE" | "API" | "MANUAL";
  value?: string;
}

export interface SubMarket {
  question: string;
  marketType: MarketType;
  options: Option[];
  totalVolume: number;
  tradeCount: number;
  status: MarketStatus;
  resolution?: Resolution;
}

export interface Event {
  name?: string;
  participants?: string[];
  participantImages?: string[];
  league?: string;
  startTime?: string;
}

export interface Metadata {
  asset?: string;
  startPrice?: number;
  targetPrice?: number;
  direction?: string;
  assetLogo?: string;   // 👈 ADD THIS
  chartImage?: string;  // 👈 ADD THIS
}

export interface Market {
  id: string; // add this

  question: string;
  marketType: MarketType;
  subMarkets: SubMarket[];
  startDate: string;
  endDate: string;
  durationMinutes: number;
  event?: Event;
  metadata?: Metadata;
  totalVolume?: number;
  tradeCount?: number;
  featured?: boolean;
  category?: string;
  createdAt?: string;
}

export const markets: Market[] = [
  {
    id: "market-1",

    question: "BTC to $80k in 5 minutes?",
    marketType: "CRYPTO",
    subMarkets: [
      {
        question: "BTC to $80k in 5 minutes?",
        marketType: "CRYPTO",
        options: [
          { label: "Yes", liquidity: 500, odds: 2.4, volume: 500, count: 18 },
          { label: "No", liquidity: 1200, odds: 1.3, volume: 1200, count: 42 }
        ],
        totalVolume: 1700,
        tradeCount: 60,
        status: "LIVE"
      }
    ],
    startDate: "2026-03-17T12:00:00Z",
    endDate: "2026-03-17T12:05:00Z",
    durationMinutes: 5,
    metadata: {
      asset: "BTC",
      startPrice: 72000,
      targetPrice: 80000,
      direction: "UP",
      assetLogo: "/img/market/coinlogo.png",
      chartImage: "/img/market/coinchart.png"
    }
  },

  {
    id: "market-2",

    question: "Who will win the election?",
    marketType: "SOCIAL",
    subMarkets: [
      {
        question: "Will Tinubu win?",
        marketType: "SOCIAL",
        options: [
          { label: "Yes", liquidity: 2000, odds: 1.8, volume: 2000, count: 95 },
          { label: "No", liquidity: 1000, odds: 3.0, volume: 1000, count: 40 }
        ],
        totalVolume: 3000,
        tradeCount: 135,
        status: "LIVE"
      },
      {
        question: "Will Atiku win?",
        marketType: "SOCIAL",
        options: [
          { label: "Yes", liquidity: 800, odds: 2.5, volume: 800, count: 30 },
          { label: "No", liquidity: 2200, odds: 1.4, volume: 2200, count: 110 }
        ],
        totalVolume: 3000,
        tradeCount: 140,
        status: "LIVE"
      }
    ],
    startDate: "2026-03-17T10:00:00Z",
    endDate: "2026-03-24T10:00:00Z",
    durationMinutes: 10080,
  },

  {
    id: "market-3",

    question: "Arsenal vs Chelsea",
    marketType: "SPORT",
    subMarkets: [
      {
        question: "Will Arsenal win?",
        marketType: "SPORT",
        options: [
          { label: "Manchester united", liquidity: 1500, odds: 1.9, volume: 1500, count: 65 },
          { label: "Chelsea", liquidity: 1500, odds: 1.9, volume: 1500, count: 70 }
        ],
        totalVolume: 3000,
        tradeCount: 135,
        status: "LIVE"
      }
    ],
    event: {
      name: "Arsenal vs Chelsea",
      participants: ["Arsenal", "Chelsea"],
      participantImages: [
        "/img/market/club1.png",
        "/img/market/club2.png"
      ],
      league: "EPL",
      startTime: "2026-03-20T15:00:00Z"
    },
    startDate: "2026-03-20T15:00:00Z",
    endDate: "2026-03-20T17:00:00Z",
    durationMinutes: 120
  },

  {
    id: "market-4",


    question: "Will this tweet hit 1M views in 24h?",
    marketType: "SOCIAL",
    subMarkets: [
      {
        question: "1M views?",
        marketType: "SOCIAL",
        options: [
          { label: "Yes", liquidity: 400, odds: 2.8, volume: 400, count: 22 },
          { label: "No", liquidity: 900, odds: 1.4, volume: 900, count: 55 }
        ],
        totalVolume: 1300,
        tradeCount: 77,
        status: "LIVE"
      }
    ],
    startDate: "2026-03-17T09:00:00Z",
    endDate: "2026-03-18T09:00:00Z",
    durationMinutes: 1440
  },

  {
    id: "market-5",

    question: "Will ETH drop below $3k today?",
    marketType: "CRYPTO",
    subMarkets: [
      {
        question: "ETH below $3k?",
        marketType: "CRYPTO",
        options: [
          { label: "Yes", liquidity: 700, odds: 2.1, volume: 700, count: 28 },
          { label: "No", liquidity: 1300, odds: 1.5, volume: 1300, count: 60 }
        ],
        totalVolume: 2000,
        tradeCount: 88,
        status: "LIVE"
      }
    ],
    startDate: "2026-03-17T00:00:00Z",
    endDate: "2026-03-17T23:59:00Z",
    durationMinutes: 1440,
    metadata: {
      asset: "ETH",
      startPrice: 3200,
      targetPrice: 3000,
      direction: "DOWN",
      assetLogo: "/img/market/coinlogo.png",
      chartImage: "/img/market/coinchart.png"
    }
  }
];