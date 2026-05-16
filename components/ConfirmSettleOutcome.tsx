"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { apiRequest } from "@/utils/apiRequest";

interface Props {
  market: any;
  outcome: string | null;
  onClose: () => void;
}

const ConfirmSettleOutcome: React.FC<Props> = ({
  market,
  outcome,
  onClose,
}) => {

  const [loading, setLoading] = useState(false);

  // =========================
  // MANUAL SETTLE
  // =========================
  const handleSettle = async () => {
    try {
      setLoading(true);

      const res = await apiRequest(
        "/admin_market/manual_settle",
        {
          method: "POST",

          body: {
            marketId: market._id,
            outcome,
          },

          showLoading: false,
          showSuccess: true,
          showError: true,
        }
      );

      if (res.success) {
        // toast.success("Market settled successfully");

        onClose();

        // optional refresh
        window.location.reload();
      }

    } catch (err) {
      console.log(err);

      toast.error("Failed to settle market");

    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 22,
          }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0D0D] p-6"
        >

          {/* TITLE */}
          <h2 className="text-xl font-semibold text-white">
            Confirm Settlement
          </h2>

          {/* QUESTION */}
          <div className="mt-5">

            <p className="text-sm text-white/50 mb-2">
              Are you sure the outcome for:
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

              <p className="text-white text-sm font-medium">
                {market?.question}
              </p>

              <div className="mt-4 flex items-center gap-2">

                <p className="text-white/40 text-sm">
                  Winning Outcome:
                </p>

                <div className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 text-sm text-white">
                  {outcome}
                </div>

              </div>

            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-6">

            {/* NO */}
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            >
              No
            </button>

            {/* YES */}
            <button
              onClick={handleSettle}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Yes, Settle"
              )}
            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
};

export default ConfirmSettleOutcome;