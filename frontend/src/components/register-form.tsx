"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/store/auth-slice";
import { useAppDispatch } from "@/lib/hooks";
import { Eye, EyeOff } from "lucide-react";

import InputField from "@/components/ui/InputField";
import ErrorBox from "@/components/ui/ErrorBox";
import SubmitBtn from "@/components/ui/SubmitBtn";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2)
      return setError("Name must be at least 2 characters.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      router.replace("/dashboard");
    } catch (err) {
      if (typeof err === "string") setError(err);
      else if (err instanceof Error) setError(err.message);
      else setError("Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "var(--fg)" }}
        >
          Create account
        </h2>
        <p
          className="text-sm sm:text-base leading-6"
          style={{ color: "var(--fg-2)" }}
        >
          Start managing your tasks with a focused, clean workflow.
        </p>
      </div>

      <InputField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
      />

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <div className="relative">
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 bottom-3 p-1"
          style={{ color: "var(--fg-2)" }}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      <SubmitBtn
        loading={loading}
        label="Create Account"
        loadingLabel="Creating..."
      />
    </form>
  );
}
