"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/utils/apiRequest";
import { type Market } from "@/data/market";

type AiInsightProps = { market: Market };

export default function AiInsight({ market }: AiInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [displayedInsight, setDisplayedInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false); // NEW: skip typing

  const localStorageKey = `aiInsight_${market.id}`;
  const hasFetched = useRef(false);

  // Clean markdown-like bold ** and trim
  const cleanText = (text: string) => {
    return text
      .replace(/#{1,6}\s*/g, "")  // remove ### headings
      .replace(/\*\*/g, "")        // remove bold **
      .replace(/\*/g, "")          // remove stray *
      .replace(/undefined/g, "")   // remove undefined
      .replace(/\r/g, "")          // remove weird carriage returns
      .trim();
  };
  // Typing effect (only if skipAnimation is false)
  useEffect(() => {
    if (!insight) return;

    if (skipAnimation) {
      setDisplayedInsight(insight);
      return;
    }

    let index = 0;
    setDisplayedInsight("");
    const interval = setInterval(() => {
      setDisplayedInsight((prev) => prev + insight[index]);
      index++;
      if (index >= insight.length) clearInterval(interval);
    }, 5); // very fast typing
    return () => clearInterval(interval);
  }, [insight, skipAnimation]);

  // Fetch once, use localStorage
  useEffect(() => {
    if (!market?.id) return;

    // 🚫 HARD STOP if already fetched
    if (hasFetched.current) return;

    const cached = localStorage.getItem(localStorageKey);
    if (cached) {
      setInsight(cached);
      setSkipAnimation(true);
      hasFetched.current = true; // ✅ lock here too
      return;
    }

    const fetchInsight = async () => {
      setLoading(true);

      try {
        const { success, data } = await apiRequest(`/ai/ai-insight`, {
          method: "POST",
          body: { market },
          showLoading: false,
        });

        if (success && data?.insight) {
          const cleaned = cleanText(data.insight); // 👈 IMPORTANT
          setInsight(cleaned);
          localStorage.setItem(localStorageKey, cleaned);
          setSkipAnimation(false);

        } else {
          setInsight("AI insight unavailable at the moment.");
          setSkipAnimation(true);
        }
      } catch {
        setInsight("AI insight unavailable at the moment.");
        setSkipAnimation(true);
      } finally {
        setLoading(false);
        hasFetched.current = true; // ✅ LOCK after first call
      }
    };

    fetchInsight();
  }, [market?.id]);

  // Parse AI response into structured sections
  const renderInsight = (text: string) => {
    if (!text) return <p className="text-gray-400">No insight available yet.</p>;

    const sectionRegex =
      /(?:\d*\.*\s*)?(Outcome Prediction|Reasoning|User\s*Advice):([\s\S]*?)(?=(?:\d*\.*\s*)?(Outcome Prediction|Reasoning|User\s*Advice):|$)/gi;
    const matches = [...text.matchAll(sectionRegex)];

    if (!matches.length) return <p className="text-gray-400">{text}</p>; // fallback

    return matches.map((match, idx) => {
      const heading = match[1].trim();
      const content = match[2].trim();

      if (!heading || !content) return null;

      // Split content into paragraphs by double newline or bullets
      const paragraphs = content
        .split(/\n{2,}|•|- /)
        .map(p => p.trim())
        .filter(Boolean);

      if (heading.toLowerCase() === "reasoning" || heading.toLowerCase() === "outcome prediction") {
        return (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold text-md mb-2">{heading}</h3>
            <div className="text-[#8B8B8B] text-sm space-y-2">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        );
      }

      if (heading.toLowerCase() === "user advice") {
        return (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold text-md mb-2">{heading}</h3>
            <ul className="list-disc list-inside space-y-2">
              {paragraphs.map((p, i) => (
                <li key={i} className="text-[#8B8B8B] text-sm">{p}</li>
              ))}
            </ul>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="p-4 mt-4 rounded-xl shadow-sm bg-[#0C0C0C] leading-relaxed">
      <h2 className="text-lg font-semibold mb-4">AI Insight</h2>
      {loading ? (
        <p className="text-gray-400">Generating AI insight...</p>
      ) : displayedInsight ? (
        renderInsight(displayedInsight)
      ) : (
        <p className="text-gray-400">No insight available yet.</p>
      )}
    </div>
  );
}