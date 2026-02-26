"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { FaWallet } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";

export default function BottomBar() {
  const pathname = usePathname();

  const items = [
    { icon: <AiOutlineHome size={24} />, label: "Home", href: "/home" },
    { icon: <FiPlusCircle size={24} />, label: "Create", href: "/create" },
    { icon: <FaWallet size={24} />, label: "Wallet", href: "/wallet" },
    { icon: <MdAccountCircle size={24} />, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-red-600 dark:bg-red-800 rounded-t-3xl text-white shadow-2xl z-30">
      <div className="relative flex justify-between items-center px-6 py-3 max-w-2xl mx-auto">
        {items.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link key={index} href={item.href}>
              <div className="flex flex-col items-center text-xs cursor-pointer relative">
                {item.icon}
                <span
                  className="mt-1 font-body transition-colors duration-300"
                  style={{ color: isActive ? "#fff" : "#ffffffaa" }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="bottom-indicator"
                    className="absolute -bottom-2 w-10 h-1 bg-white rounded-full shadow-lg"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}