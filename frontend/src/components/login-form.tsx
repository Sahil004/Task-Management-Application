'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/components/toast-provider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser, selectAuth } from '@/lib/store/auth-slice';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Email and password are required.');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      showToast({
        tone: 'success',
        title: 'Welcome back',
        description: 'You are signed in and ready to manage your tasks.',
      });
      router.replace('/dashboard');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to login.');
      showToast({
        tone: 'error',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Unable to login.',
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-3xl font-semibold text-ink">Login</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">Your task dashboard is one step away.</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Email</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-4 py-3 outline-none transition focus:border-dusk"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Password</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-4 py-3 outline-none transition focus:border-dusk"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {(formError || auth.error) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError || auth.error}
        </div>
      )}

      <button
        type="submit"
        disabled={auth.loading}
        className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {auth.loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
