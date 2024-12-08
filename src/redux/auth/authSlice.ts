import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local",
        credentials
      );

      localStorage.setItem("token", response.data.jwt);

      return {
        user: response.data.user,
        token: response.data.jwt,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login gagal");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: { email: string; password: string; username: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local/register",
        userData
      );

      return {
        user: response.data.user,
        token: response.data.jwt,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registrasi gagal"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/logout");

      localStorage.removeItem("token");

      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout gagal");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log("Login berhasil:", action.payload);
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
