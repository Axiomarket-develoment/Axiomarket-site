"use client";

import { Template } from "@/data/market";
import CategorySelect from "../CategorySelect";

type Category = "Crypto" | "Meme Coins" | "Football" | "X";

interface Props {
  category: Category;
  setCategory: (c: Category) => void;
  setTemplate: (t: Template | null) => void;
  setValues: (v: Record<string, any>) => void;
}

const MARKET_TYPES: Category[] = [
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