"use client";

import { useEffect } from "react";
import { SUGGESTIONS } from "@/data/Template";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Template, Field } from "@/data/market";

/* ---------------- TYPES ---------------- */

type TimeOption = {
  label: string;
  value: string;
};

type SelectOption = string | TimeOption;



type Values = Record<string, any>;

type Props = {
  template: Template | null;
  values: Values;
  setValues: React.Dispatch<React.SetStateAction<Values>>;
  category: string;
};

/* ---------------- COMPONENT ---------------- */

export default function InlineBuilder({
  template,
  values,
  setValues,
  category,
}: Props) {
  const [activeToken, setActiveToken] = useState<string | null>(null);

  useEffect(() => {
    if (template && !activeToken) {
      setActiveToken(template.fields[0]?.key || null);
    }
  }, [template]);


  if (!template) {
    return (
      <div className="text-[#8B8B8B] text-sm  rounded-lg">
        Select a template to start building your question...
      </div>
    );
  }

  const currentField = template.fields.find(
    (f) => f.key === activeToken
  );

  const normalizeCategory = (c: string) =>
  c.toUpperCase().replace(" ", "_");

 const getSuggestions = (category: string, fieldKey: string) => {
  return SUGGESTIONS?.[normalizeCategory(category)]?.[fieldKey] ?? [];
};



  const numberSuggestions =
    currentField?.type === "number"
      ? [2, 5, 10, 15, 20]
      : [];

  const formatPlaceholder = (key: string) => {
    switch (key) {
      case "name":
        return "@username";
      case "number":
        return "number";
      case "timePhrase":
        return "time";
      default:
        return key;
    }
  };

  const normalize = (v: any) =>
    typeof v === "object" ? v.value : v;

  const handleReplace = (key: string, value: any) => {
    const raw = normalize(value);

    setValues((prev) => ({
      ...prev,
      [key]: raw,
    }));

    // if (key === "timePhrase") {
    //   const now = new Date();
    //   let end = new Date();

    //   switch (raw) {
    //     case "1h":
    //       end = new Date(now.getTime() + 60 * 60 * 1000);
    //       break;
    //     case "24h":
    //       end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    //       break;
    //     case "7d":
    //       end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    //       break;
    //     case "tomorrow":
    //       end.setDate(now.getDate() + 1);
    //       break;
    //     case "thursday": {
    //       const day = 4;
    //       const diff = (day - now.getDay() + 7) % 7 || 7;
    //       end.setDate(now.getDate() + diff);
    //       break;
    //     }
    //   }

    //   setValues((prev) => ({
    //     ...prev,
    //     timePhrase: value.label ?? raw,
    //   }));
    // }

    setActiveToken(null);
  };

  const renderSentence = () => {
    const parts = template.template.split(/(\{.*?\})/g);

    return parts.map((part, i) => {
      const match = part.match(/\{(.*?)\}/);

      if (!match) return <span key={i}>{part}</span>;

      const key = match[1];

      return (
        <span
          key={`${key}-${i}`}
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setActiveToken(key);
          }}
          className="px-1 py-1.5 mx-1 rounded-sm bg-[#222] rounded cursor-pointer text-[#FF394A]"
        >
          {values[key] ?? formatPlaceholder(key)}
        </span>
      );
    });
  };

  return (
    <div className="text-white relative ">
      {/* SENTENCE */}
      <div className="p- py-  text-sm bg-transparent  rounded-lg whitespace-nowrap overflow-x-auto">
        {renderSentence()}
      </div>

      {/* OPTIONS */}
      <AnimatePresence mode="wait">
        {activeToken && currentField && (
          <motion.div
            key={activeToken}
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0A0A0B] p-4 rounded-t-2xl shadow-xl min-h-[50dvh] max-h-[50dvh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* TEXT + SUGGESTIONS */}
            {currentField.type === "text" && (
              <div className="space-y-2">
                {getSuggestions(category, currentField.key).map(
                  (opt: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleReplace(activeToken, opt.value)}
                      className="p-2 hover:bg-[#222] cursor-pointer"
                    >
                      {opt.label}
                    </motion.div>
                  )
                )}

                <div className="text-xs text-[#555] mt-2">
                  or enter custom
                </div>

                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleReplace(
                        activeToken,
                        (e.target as HTMLInputElement).value
                      );
                    }
                  }}
                  className="w-full p-2 bg-[#222] rounded"
                />
              </div>
            )}

            {/* NUMBER */}
            {currentField.type === "number" && (
              <div className="space-y-2">


                {numberSuggestions.length > 0 && (
                  <div className="flex gap-2 flex-col ">
                    {numberSuggestions.map((n) => (
                      <div
                        key={n}
                        onClick={() => handleReplace(activeToken, n)}
                        className="px-2 py-3 bg-[#] rounded cursor-pointer"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="number"
                  placeholder="type number"
                  onKeyDown={(e) => {
                    const val = (e.target as HTMLInputElement).value;

                    if (!val) return;

                    handleReplace(activeToken, Number(val));
                  }}
                  className="w-full p-2 py-3 bg-[#222] rounded"
                />
              </div>
            )}

            {/* SELECT */}
            {currentField.type === "select" &&
              currentField.options?.map((opt, idx) => {
                const label =
                  typeof opt === "object" ? opt.label : opt;

                const value =
                  typeof opt === "object" ? opt.value : opt;

                return (
                  <div
                    key={`${label}-${idx}`}
                    onClick={() =>
                      handleReplace(activeToken, value)
                    }
                    className="p-2 py-3 hover:bg-[#222] cursor-pointer"
                  >
                    {label}
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}