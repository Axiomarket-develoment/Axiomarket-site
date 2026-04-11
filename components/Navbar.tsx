"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import ThemeSwitch from "./ThemeSwitch";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(prev => !prev);

  const router = useRouter();

  const pathname = usePathname();
  const navlink = [
    {
      name: "Home",
      href: "/home"
    },
    {
      name: "Market",
      href: "/market"
    },
    // {
    //   name: "Waitlist",
    //   href: "/waitlist"
    // },
    {
      name: "Leaderboard",
      href: "/leaderboard"
    }
  ];

  return (
    <div className="sticky  z-50 backdrop-blur-2xl top-8 bg-[#0D0D0D] shadow-2xl w-fit mx-auto rounded-[50px]  mt-6 border-red-100 " >
      {/* Navbar */}
      < div className="flex items-center justify-between w-full max-w-6xl mx-auto py-2 px-3" >
        <Image width={180} height={70} src="/img/home/logofull.svg" alt="Axio Market Logo" />

        <div>
          {navlink.map((item, index) => {
            const isActive = pathname.replace(/\/$/, "") === item.href;

            return (
              <a
                key={index}
                href={item.href}
                className={`text- mx-4 font-medium transition-all duration-300 
      ${isActive
                    ? "text-white opacity-100"
                    : "text-white opacity-20 hover:opacity-70"
                  }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors duration-300"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, rgba(255,255,255,0.5), #262626, #000000) border-box",
          }}
        >
          Sign Up
        </button>
        {/* <ThemeSwitch /> */}
      </div >

      {/* Modal + Overlay */}

    </div >
  );
}



// <AnimatePresence>
//       {modalOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={toggleModal}
//             className="fixed inset-0 bg-black backdrop-blur-sm z-40"
//           />

//           <motion.div
//             initial={{ y: "100%", opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: "100%", opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white dark:bg-black p-6 shadow-2xl rounded-t-3xl z-50"
//           >
//             <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
//               Create Your Account
//             </h2>
//             {/* Sign-up buttons / inputs */}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>