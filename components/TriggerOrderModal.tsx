"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Market } from "@/data/market";
import Image from "next/image";
import { apiRequest } from "@/utils/apiRequest";
import toast from "react-hot-toast";
import { convertBalanceToUSD } from "@/utils/getAvaxPrice";
import { setLocalStorage } from "@/utils/localStorage";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import SuccessScreen from "./SuccessScreen";

interface Props {
    onClose?: () => void;
    market: Market;
    onSuccess?: () => void;
    logo?: string | null;
    outcome?: string | null;
    odds?: number | null;
    endDate: string; // ✅ NEW
}

const getTimeLeft = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();

    const diff = end - now;

    if (diff <= 0) return "Ended";

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
};

const TriggerOrderModal: React.FC<Props> = ({ onClose, market, logo, outcome, odds, endDate, onSuccess }) => {
    const [amount, setAmount] = useState<number | "">("");
    const [showWave, setShowWave] = useState(false);
    const [avaxBalance, setAvaxBalance] = useState<number>(0);


    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));


    useEffect(() => {
        const userStr = localStorage.getItem("user");

        if (!userStr) return;

        const user = JSON.parse(userStr);
        const userId = user?._id;

        if (!userId) return;

        const ref = doc(db, "users", userId);

        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setAvaxBalance(Number(data?.avaxBalance ?? 0));
            }
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    // Inside TriggerOrderModal.tsx


    const handleSubmit = async () => {
        if (status === "loading") return;

        setShowWave(true);

        const token = localStorage.getItem("token") || "";

        if (!amount || amount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (amount > avaxBalance) {
            toast.error("Insufficient balance");
            return;
        }

        if (!outcome) {
            toast.error("Select an outcome");
            return;
        }

        setShowWave(false);
        setStatus("loading");

        try {
            const usdAmount = await convertBalanceToUSD(amount);

            const response = await apiRequest("/user_market/user_enter_market", {
                method: "POST",
                body: {
                    marketId: market.id,
                    token,
                    subMarketId: market.subMarkets[0].id,
                    outcome,
                    price: odds,
                    amount: usdAmount,
                },
            });
            if (response.success) {
                setLocalStorage("cachedBalance", response.data.balance.testnet);
                setLocalStorage("user", response.data.user);

                onSuccess?.();

              
                return;
            }
            else {
                setStatus("idle");
            }

        } catch (err) {
            console.error(err);
            setStatus("idle");
        }
    };


    return (
        <>


            <AnimatePresence>
                <motion.div
                    className="h-[100dvh] w-full bg-black/20 backdrop-blur-xs fixed top-0 left-0 z-50 flex justify-center items-end md:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#050505] rounded-2xl w-full max-w-md p-4"
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3 className="text-sm text-center font-semibold my-4">Make Your Prediction</h3>
                        {/* Market info */}
                        <div className="flex items-center gap-2 mb-4">
                            {logo && (
                                <Image
                                    src={logo}
                                    alt={market.metadata?.asset || "logo"}
                                    width={42}
                                    height={42}
                                />
                            )}
                            <h2 className="text-white font-bold mb-2 text-sm">{market.question}</h2>
                        </div>

                        <div className="flex bg-[#0C0C0C] py-5 px-3 rounded-lg items-center justify-between w-full">


                            {outcome && (
                                <span className=" text-xs text-green-400 font-semibold">
                                    {outcome?.toUpperCase()} - {odds != null ? (odds % 1 === 0 ? `${odds}` : odds) : ""}%
                                </span>
                            )}
                            <p className="text-xs text-gray-400  ">
                                {timeLeft === "Ended" ? "Market Ended" : `Ends in ${timeLeft}`}
                            </p>
                        </div>
                        {/* Input for amount */}
                        <div className="flex w-full items-center gap-2 my-4">
                            {/* <label className="text-xs text-gray-400">Amount (AVAX)</label> */}
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAmount(val === "" ? "" : Number(val));
                                }}
                                placeholder="0.0"
                                className="bg-[#0C0C0C] placeholder:text-[#56CD00] rounded-full text-[#56CD00] text-sm placeholder:text-sm w-full  p-3 py-3  focus:outline-none"
                            />

                            <div
                                className={`relative flex gap-1 py-3 px-6 bg-[#000000] items-center rounded-full w-fit cursor-pointer overflow-hidden
                ${showWave ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                onClick={handleSubmit}
                            >
                                {showWave && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-[#000000] opacity-50 animate-wave"></div>
                                )}
                                <p className="text-[#FF394A] text-sm font-semibold whitespace-nowrap z-10">
                                    Axe It
                                </p>
                                <Image width={20} alt="" height={20} src={"/img/logo2.svg"} className="z-10" />
                            </div>
                        </div>



                        {/* Submit button */}

                    </motion.div>
                </motion.div>

            </AnimatePresence>

        </>
    );
};

export default TriggerOrderModal;