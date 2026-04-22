import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/token-storage";
import { User } from "@/lib/types";

import { RootState } from "@/lib/store";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  hydrated: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { name: string; email: string; password: string }) =>
    api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) =>
    api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api<{ message: string }>("/auth/logout", {
    method: "POST",
    auth: true,
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreAuth: (state) => {
      state.token = tokenStorage.getToken();
      state.user = tokenStorage.getUser();
      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.hydrated = true;
        tokenStorage.setToken(action.payload.token);
        tokenStorage.setUser(action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.hydrated = true;
        tokenStorage.setToken(action.payload.token);
        tokenStorage.setUser(action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.hydrated = true;
        tokenStorage.clearToken();
        tokenStorage.clearUser();
      });
  },
});

export const { restoreAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
