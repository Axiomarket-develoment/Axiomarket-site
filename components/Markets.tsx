import React from "react";
import MarketItem from "./MarketItem";
import { markets } from "@/data/market";

const Markets = () => {
  return (
    <div className="p-4 mb-24 grid gap-4">
      {markets.map((market, index) => (
        <MarketItem key={index} market={market} />
      ))}
    </div>
  );
};

export default Markets;