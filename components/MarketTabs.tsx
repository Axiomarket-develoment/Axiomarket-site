"use client";
import { motion } from "framer-motion";

export type Tab = "Chart" | "AI" | "Chat";

interface TabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  hideChart?: boolean;
}

export function Tabs({ activeTab, onChange, hideChart }: TabsProps) {
  const tabs: { label: Tab; icon: string; activeIcon: string }[] = hideChart
    ? [
        {
          label: "AI",
          icon: "/img/market/ai.svg",
          activeIcon: "/img/market/aai.svg",
        },
        {
          label: "Chat",
          icon: "/img/market/chat.svg",
          activeIcon: "/img/market/achat.svg",
        },
      ]
    : [
        {
          label: "Chart",
          icon: "/img/market/chart.svg",
          activeIcon: "/img/market/achart.svg",
        },
        {
          label: "AI",
          icon: "/img/market/ai.svg",
          activeIcon: "/img/market/aai.svg",
        },
        {
          label: "Chat",
          icon: "/img/market/chat.svg",
          activeIcon: "/img/market/achat.svg",
        },
      ];

  return (
    <div className="flex gap-2 w-full justify-between">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <motion.button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center w-full gap-2 px-4 py-3 justify-center rounded-full font-semibold ${
              isActive
                ? "text-white bg-[#FF394A]"
                : "text-[#8B8B8B] bg-[#0C0C0C]"
            }`}
          >
            <img
              src={isActive ? tab.icon : tab.activeIcon}
              className="w-5 h-5"
              alt={tab.label}
            />
            <span className="text-sm">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}