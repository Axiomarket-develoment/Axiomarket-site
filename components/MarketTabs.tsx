"use client";
import { motion } from "framer-motion";

interface TabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export type Tab = "Chart" | "AI" | "Chat";

export function Tabs({ activeTab, onChange }: TabsProps) {
  const tabs: { label: Tab; icon: string; activeIcon: string }[] = [
    { label: "Chart", icon: "/img/market/chart.svg", activeIcon: "/img/market/achart.svg" },
    { label: "AI", icon: "/img/market/ai.svg", activeIcon: "/img/market/aai.svg" },
    { label: "Chat", icon: "/img/market/chat.svg", activeIcon: "/img/market/achat.svg" },
  ];

  return (
    <div className="flex gap-2 w-full justify-between relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <motion.button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
            className={`flex items-center rounded-full w-full gap-1 px-4 py-4 justify-center font-semibold transition-colors duration-300 ${isActive
              ? "text-white bg-[#FF394A] shadow-lg"
              : "text-[#8B8B8B] bg-[#0C0C0C] hover:text-white hover:bg-[#1f1f1f]"
              }`}
          >
            <motion.img
              src={isActive ? tab.icon : tab.activeIcon}
              alt={tab.label}
              className="w-5 h-5"
              animate={{ rotate: isActive ? 15 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <p className="text-sm">{tab.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}