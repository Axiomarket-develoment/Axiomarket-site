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
  _id: any;
  id: any;
  outcomes: any;
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
  assetSymbol: string;
  direction?: string;
  assetLogo?: string;   // 👈 ADD THIS
  chartImage?: string;  // 👈 ADD THIS
}

export interface Market {
  _id: string;
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
  status: string;
  createdAt?: string;
}

