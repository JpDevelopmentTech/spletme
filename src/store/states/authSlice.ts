import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuth: localStorage.getItem("isAuth") == "true" ? "true" : "false",
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : {},
    },
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = action.payload.isAuth;
            state.user = action.payload.user;
        },
    },
});



export const { setAuth } = authSlice.actions;
export default authSlice.reducer;



