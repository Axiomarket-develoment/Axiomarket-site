"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents hydration mismatch

  return theme === "dark" ? (
    <FiSun
      size={22}
      className="cursor-pointer"
      onClick={() => setTheme("light")}
    />
  ) : (
    <FiMoon
      size={22}
      className="cursor-pointer"
      onClick={() => setTheme("dark")}
    />
  );
}