"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/utils/apiRequest";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type Market } from "@/data/market";

type AiInsightProps = { market: Market };

export default function AiInsight({ market }: AiInsightProps) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const localStorageKey = `aiInsight_${market.id}`;
  const hasFetched = useRef(false);

  // ---------------------------
  // FETCH AI INSIGHT (ONCE)
  // ---------------------------
  useEffect(() => {
    if (!market?.id) return;
    if (hasFetched.current) return;

    const cached = localStorage.getItem(localStorageKey);

    if (cached) {
      setInsight(cached);
      hasFetched.current = true;
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
          const clean = data.insight
            .replace(/undefined/g, "")
            .trim();

          setInsight(clean);
          localStorage.setItem(localStorageKey, clean);
        } else {
          setInsight("AI insight unavailable at the moment.");
        }
      } catch (err) {
        setInsight("AI insight unavailable at the moment.");
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchInsight();
  }, [market?.id]);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="p-4 mt-4 rounded-xl bg-[#0C0C0C]">
      <h2 className="text-lg font-semibold mb-4">AI Insight</h2>

      {loading ? (
        <p className="text-gray-400">Generating AI insight...</p>
      ) : (
        <div className="text-sm text-[#8B8B8B] leading-relaxed space-y-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {insight}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}