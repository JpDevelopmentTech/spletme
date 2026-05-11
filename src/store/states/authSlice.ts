import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

interface AuthState {
  isAuth: "true" | "false";
  user: User | Record<string, never>;
}

interface SetAuthPayload {
  isAuth: "true" | "false";
  user: User;
}

const initialState: AuthState = {
  isAuth: localStorage.getItem("isAuth") === "true" ? "true" : "false",
  user: localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user")!) as User)
    : {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user;
      localStorage.setItem("isAuth", action.payload.isAuth);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;



