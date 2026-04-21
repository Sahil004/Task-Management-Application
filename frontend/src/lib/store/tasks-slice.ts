import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '@/lib/api';
import { DashboardData, Task, TaskFormValues, TaskReorderInput } from '@/lib/types';
import { RootState } from '@/lib/store';

interface TasksState {
  items: Task[];
  dashboard: DashboardData | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  dashboard: null,
  loading: false,
  submitting: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { status?: string; priority?: string; sortBy?: string; order?: string }) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        search.set(key, value);
      }
    });

    return api<{ count: number; tasks: Task[] }>(`/tasks?${search.toString()}`, { auth: true });
  },
);

export const fetchDashboard = createAsyncThunk('tasks/fetchDashboard', async () =>
  api<DashboardData>('/tasks/dashboard', { auth: true }),
);

export const createTask = createAsyncThunk('tasks/createTask', async (values: TaskFormValues) =>
  api<{ task: Task }>('/tasks', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      ...values,
      dueDate: values.dueDate || null,
    }),
  }),
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, values }: { id: string; values: TaskFormValues }) =>
    api<{ task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({
        ...values,
        dueDate: values.dueDate || null,
      }),
    }),
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await api<{ message: string }>(`/tasks/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  return id;
});

export const reorderTasks = createAsyncThunk(
  'tasks/reorderTasks',
  async (payload: { tasks: TaskReorderInput[]; nextItems: Task[] }) => {
    await api<{ message: string }>('/tasks/reorder', {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ tasks: payload.tasks }),
    });

    return payload.nextItems;
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unable to fetch tasks';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload.task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Unable to create task';
      })
      .addCase(updateTask.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.map((task) =>
          task._id === action.payload.task._id ? action.payload.task : task,
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Unable to update task';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(reorderTasks.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = action.payload;
      })
      .addCase(reorderTasks.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Unable to reorder tasks';
      });
  },
});

export const selectTasks = (state: RootState) => state.tasks;
export default tasksSlice.reducer;
