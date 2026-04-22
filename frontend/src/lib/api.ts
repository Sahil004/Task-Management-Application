import { tokenStorage } from './token-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiOptions extends RequestInit {
  auth?: boolean;
}


export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth) {
    const token = tokenStorage.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error ||
      data?.errors?.[0]?.msg ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}
