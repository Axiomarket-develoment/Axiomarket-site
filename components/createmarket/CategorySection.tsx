"use client";

import { MarketCategory, Template } from "@/data/market";
import CategorySelect from "../CategorySelect";

interface Props {
  category: MarketCategory;
  setCategory: (c: MarketCategory) => void;
  setTemplate: (t: Template | null) => void;
  setValues: (v: Record<string, any>) => void;
}

const MARKET_TYPES: MarketCategory[] = [
  "Crypto",
  "Meme Coins",
  "Football",
  "X"
];

export default function CategorySection({
  category,
  setCategory,
  setTemplate,
  setValues
}: Props) {
  return (
    <CategorySelect
      MARKET_TYPES={MARKET_TYPES}
      category={category}
      setCategory={setCategory}
      setTemplate={setTemplate}
      setValues={setValues}
    />
  );
}