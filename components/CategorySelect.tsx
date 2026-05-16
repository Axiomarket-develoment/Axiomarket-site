"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketCategory } from "@/data/market";


interface Props {
  MARKET_TYPES: MarketCategory[];
  category: MarketCategory;
  setCategory: (value: MarketCategory) => void;
  setTemplate: (value: any) => void;
  setValues: (value: Record<string, any>) => void;
}



export default function CategorySelect({
  MARKET_TYPES,
  category,
  setCategory,
  setTemplate,
  setValues,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: MarketCategory) => {
    setCategory(value);
    setTemplate(null);
    setValues({});
    setOpen(false);
  };

  return (
    <div className="mb-4 relative">
      <label className="text-[#E4E4E4] text-sm mb-2 block">
        Category
      </label>

      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full p-3 text-sm bg-[#0A0A0B] border border-[#1B1B1B] text-white rounded-xl cursor-pointer flex justify-between items-center hover:border-[#2a2a2a] transition"
      >
        <span>{category}</span>
        <span className={`text-[#8B8B8B] text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute w-full mt-2 bg-[#0A0A0B] border border-[#1B1B1B] rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {MARKET_TYPES.map((t) => (
              <div
                key={t}
                onClick={() => handleSelect(t)}
                className={`px-4 py-3 cursor-pointer transition text-sm ${
                  category === t
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#8B8B8B] hover:bg-[#141414] hover:text-white"
                }`}
              >
                {t}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}