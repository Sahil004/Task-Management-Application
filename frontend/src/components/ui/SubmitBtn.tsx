"use client";

import { Loader } from "lucide-react";

type Props = {
  loading: boolean;
  label: string;
  loadingLabel: string;
};

export default function SubmitBtn({ loading, label, loadingLabel }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      style={{
        background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
        boxShadow: "0 0 20px rgba(110,115,255,0.3)",
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader size={14} className="animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
