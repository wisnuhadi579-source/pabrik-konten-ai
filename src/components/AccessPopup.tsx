import React, { useState } from "react";
import { motion } from "motion/react";

interface Props {
  plan: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccessPopup: React.FC<Props> = ({ plan, onClose, onSuccess }) => {
  const [code, setCode] = useState("");

  const PREMIUM_CODE = "PREMIUM-ACCESS-2026";
  const VIP_CODE = "VIP-ACCESS-2026";

  const handleSubmit = () => {
    if (plan === "Premium" && code === PREMIUM_CODE) {
      localStorage.setItem("user_role", "premium");
      onSuccess();
      return;
    }

    if (plan === "VIP" && code === VIP_CODE) {
      localStorage.setItem("user_role", "vip");
      onSuccess();
      return;
    }

    alert("Kode akses salah");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-[380px]"
      >
        <h2 className="text-xl font-bold mb-2">Akses {plan}</h2>

        <p className="text-gray-400 text-sm mb-4">
          Tool ini membutuhkan akses {plan}.
        </p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Masukkan kode akses"
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg"
          >
            Masukkan Kode
          </button>

          <a
            href="https://lynk.id"
            target="_blank"
            className="flex-1 text-center border border-white/10 py-2 rounded-lg hover:bg-white/10"
          >
            Beli Akses
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-white"
        >
          Tutup
        </button>
      </motion.div>

    </div>
  );
};