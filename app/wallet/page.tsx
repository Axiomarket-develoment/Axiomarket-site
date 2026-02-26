import React from "react";

// ✅ Metadata for this page
export const metadata = {
    title: "Wallet | Axio Market",
    description: "View your wallet balances, transactions, and manage funds on Axio Market.",
    icons: { icon: "/img/logo.png" },
};

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-cyan-50 dark:bg-black/70 text-black dark:text-white p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-4">Your Wallet</h1>
            <p className="text-gray-700 mt-12 dark:text-gray-300">
                This is where users will see their balances, transactions, and manage funds.
            </p>
        </div>
    );
}