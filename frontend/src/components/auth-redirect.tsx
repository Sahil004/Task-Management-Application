'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { restoreAuth, selectAuth } from '@/lib/store/auth-slice';

export function AuthRedirect({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: 'guest-only' | 'protected';
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.hydrated) {
      return;
    }

    if (mode === 'guest-only' && auth.token) {
      router.replace('/dashboard');
      return;
    }

    if (mode === 'protected' && !auth.token) {
      router.replace('/login');
    }
  }, [auth.hydrated, auth.token, mode, router]);

  if (!auth.hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-center shadow-panel">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-sand" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            Preparing Workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Restoring your session and routing you to the right screen.
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'guest-only' && auth.token) {
    return null;
  }

  if (mode === 'protected' && !auth.token) {
    return null;
  }

  return <>{children}</>;
}
