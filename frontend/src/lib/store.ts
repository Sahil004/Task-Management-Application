import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./store/auth-slice";
import tasksReducer from "./store/tasks-slice";
import themeReducer from "./store/theme-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
