export type MarketType = "CRYPTO" | "SOCIAL" | "SPORT" | "X" | "MEME COINS";
export type MarketStatus = "PENDING" | "LIVE" | "ENDED" | "SETTLED";


export type FieldType = "text" | "number" | "select" | "time";

export type MarketCategory =
  | "Crypto"
  | "Meme Coins"
  | "Football"
  | "X";

export interface Field {
  key: string;
  type: FieldType;
  placeholder?: string;
  options?: any[];
}

export interface Template {
  label?: string;
  template: string;
  fields: Field[];
}


export interface outcomes {
  label: string;
  liquidity: number;
  odds?: number;
  volume: number;
  count?: number;
  pool?: number;
  percentage?: number;
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
  question: string;
  marketType: MarketType;
  outcomes: outcomes[];
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
  profileImage?: string;
  

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
  savedMarkets: string[]
  durationMinutes: number;
  conversationId: string;
  event?: Event;
  metadata?: Metadata;
  marketMode?: string;
  totalVolume?: number;
  tradeCount?: number;
  featured?: boolean;
  category?: string;
  status: string;
  createdAt?: string;
}

