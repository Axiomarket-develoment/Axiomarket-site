import React from 'react';
import { motion } from "framer-motion";


type HistoryItem = {
    marketQuestion: string;
    outcomePicked: string;
    priceBought?: number;
    amountStaked: number;
    potentialWin: number;
    marketResult?: string;
    userOutcome: "PENDING" | "WIN" | "LOSE";
    marketStatus?: string;
    image?: string;
    date: string;
};


type Props = {
    history: HistoryItem;
};

const formatText = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const HistoryCard: React.FC<Props> = ({ history }) => {
    const {
        marketQuestion,
        outcomePicked,
        amountStaked,
        potentialWin,
        userOutcome,
        image,
        date
    } = history;

    const outcomeColor =
        userOutcome === "WIN"
            ? "text-[#56CD00]"
            : userOutcome === "LOSE"
            ? "text-red-500"
            : "text-yellow-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className='bg-[#090909] w-full border px-3 rounded-lg py-3 border-white/5 my-3'
        >
            {image && (
                <img
                    src={image}
                    alt={marketQuestion}
                    className="w-full rounded-md mb-3"
                />
            )}

            <h3 className='font-semibold text-base mb-1'>
                {marketQuestion}
            </h3>

            <p className='text-[#8B8B8B] text-sm mb-4'>
                Picked: <span className="capitalize">{formatText(outcomePicked)}</span>
            </p>

            <div className='flex justify-between items-center'>
                <div className='flex gap-5 text-sm'>
                    <div>
                        <p className='text-[#8B8B8B]'>Stake</p>
                        <p className="text-white font-medium">
                            ${amountStaked.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className='text-[#8B8B8B]'>Potential</p>
                        <p className="text-[#56CD00] font-medium">
                            ${potentialWin.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className='text-[#8B8B8B] text-sm'>Result</p>
                    <p className={`font-semibold ${outcomeColor}`}>
                        {formatText(userOutcome)}
                    </p>
                </div>
            </div>

            <p className='text-[#8B8B8B] text-xs mt-4'>
                {new Date(date).toLocaleString()}
            </p>
        </motion.div>
    );
};

export default HistoryCard;