"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // dispatch(registerUser({ name, email, password }))
      await new Promise((r) => setTimeout(r, 800));
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--fg)" }}>
          Create account
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--fg-2)" }}>
          Start managing your tasks with a focused, clean workflow.
        </p>
      </div>

      <InputField
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        value={name}
        onChange={setName}
      />
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        value={password}
        onChange={setPassword}
      />

      {error && <ErrorBox message={error} />}

      <SubmitBtn
        loading={loading}
        label="Create Account"
        loadingLabel="Creating account..."
      />

      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--fg-3)" }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* accent bar */}
      <div
        className="h-0.5 rounded-full"
        style={{
          background: "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
        }}
      />
    </form>
  );
}

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--fg)" }}
      >
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200"
        style={{
          border: "1px solid var(--border-2)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#6e73ff";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(110,115,255,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-2)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </label>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm flex items-start gap-2"
      style={{
        border: "1px solid rgba(255,110,156,0.3)",
        background: "rgba(255,110,156,0.08)",
        color: "#ff6e9c",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

function SubmitBtn({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
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
