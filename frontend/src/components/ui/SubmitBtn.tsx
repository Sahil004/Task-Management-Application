"use client";

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
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
