'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser, selectAuth } from '@/lib/store/auth-slice';

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      router.replace('/dashboard');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to register.');
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-3xl font-semibold text-ink">Register</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Create your account and start managing your tasks with a focused workflow.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Full Name</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-4 py-3 outline-none transition focus:border-dusk"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

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
          placeholder="At least 6 characters"
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
        className="w-full rounded-2xl bg-clay px-4 py-3 text-sm font-semibold text-white transition hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {auth.loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
