'use client';

import { Provider } from 'react-redux';

import { ToastProvider } from '@/components/toast-provider';
import { store } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
