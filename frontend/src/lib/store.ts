import { configureStore } from '@reduxjs/toolkit';

import authReducer from './store/auth-slice';
import tasksReducer from './store/tasks-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
