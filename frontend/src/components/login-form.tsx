"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/store/auth-slice";

import InputField from "@/components/ui/InputField";
import ErrorBox from "@/components/ui/ErrorBox";
import SubmitBtn from "@/components/ui/SubmitBtn";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email and password are required.");
    }

    setLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.replace("/dashboard");
    } catch (err) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--fg)" }}>
          Welcome back
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--fg-2)" }}>
          Your task dashboard is one step away.
        </p>
      </div>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />

      {error && <ErrorBox message={error} />}

      <SubmitBtn
        loading={loading}
        label="Sign In"
        loadingLabel="Signing in..."
      />
    </form>
  );
}
