import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

axios.defaults.baseURL = "http://localhost:8080";

export type TaskStatus = "pending" | "done"

interface Task {
  id: number;
  title: string;
  status: TaskStatus
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const getAuthToken = (getState: () => RootState) => {
  const token = getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get("/api/tasks/", {
        headers: getAuthToken(getState),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch tasks");
    }
  }
);

export const getTask = createAsyncThunk<Task, number, { state: RootState }>(
  "tasks/getTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tasks/${id}`, {
        headers: getAuthToken(getState),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch task");
    }
  }
);

export const addTask = createAsyncThunk<Task, { title: string }, { state: RootState }>(
  "tasks/addTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/tasks/", taskData, {
        headers: getAuthToken(getState),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to add task");
    }
  }
);

export const updateTask = createAsyncThunk<Task, { id: number; title?: string; status?: "pending" | "done" }, { state: RootState }>(
  "tasks/updateTask",
  async ({ id, ...updates }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates, {
        headers: getAuthToken(getState),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk<number, number, { state: RootState }>(
  "tasks/deleteTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: getAuthToken(getState),
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
