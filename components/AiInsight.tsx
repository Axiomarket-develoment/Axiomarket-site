"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/apiRequest";
import { type Market } from "@/data/market";

type AiInsightProps = { market: Market };

export default function AiInsight({ market }: AiInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [displayedInsight, setDisplayedInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false); // NEW: skip typing

  const localStorageKey = `aiInsight_${market.id}`;

  // Clean markdown-like bold ** and trim
  const cleanText = (text: string) => text.replace(/\*\*/g, "").trim();

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
    if (!market) return;

    const cached = localStorage.getItem(localStorageKey);
    if (cached) {
      setInsight(cached);
      setSkipAnimation(true); // skip animation if loaded from cache
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
          setInsight(data.insight);
          localStorage.setItem(localStorageKey, data.insight);
          setSkipAnimation(false); // run typing animation
        } else {
          setInsight("AI insight unavailable at the moment.");
          setSkipAnimation(true);
        }
      } catch {
        setInsight("AI insight unavailable at the moment.");
        setSkipAnimation(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [market]);

  // Parse AI response into structured sections
  const renderInsight = (text: string) => {
    if (!text) return <p className="text-gray-400">No insight available yet.</p>;

    const sectionRegex =
      /(?:\d*\.*\s*)?(Outcome Prediction|Reasoning|User Advice):([\s\S]*?)(?=(?:\d*\.*\s*)?(Outcome Prediction|Reasoning|User Advice):|$)/gi;

    const matches = [...text.matchAll(sectionRegex)];

    if (!matches.length) return <p className="text-gray-400">{text}</p>; // fallback

    return matches.map((match, idx) => {
      const heading = match[1].trim();
      const content = match[2].trim();

      if (!heading || !content) return null;

      const points = content
        .split(/\* |\d+\. /)
        .map((p) => p.replace(/\*\*/g, "").trim())
        .filter(Boolean);

      if (heading.toLowerCase() === "reasoning") {
        return (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold text-md mb-2">{heading}</h3>
            <ul className="list-disc list-inside space-y-1">
              {points.map((p, i) => (
                <li className="text-[#8B8B8B] text-sm" key={i}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      if (heading.toLowerCase() === "user advice") {
        return (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold text-md mb-2">{heading}</h3>
            <ul className="list-decimal list-inside space-y-1">
              {points.map((p, i) => (
                <li className="text-[#8B8B8B] text-sm" key={i}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return (
        <div key={idx} className="mb-4">
          <h3 className="font-semibold text-md mb-2">{heading}</h3>
          <p className="text-[#8B8B8B] text-sm">{points.join(" ")}</p>
        </div>
      );
    });
  };

  return (
    <div className="p-4 mt-4 rounded-xl shadow-sm bg-[#0C0C0C]">
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