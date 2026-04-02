"use client"

import { createSlice } from "@reduxjs/toolkit"
import { AuthState } from "./authtype"
import {
    signupUser,
    loginUser,
    logoutUser
} from "./authAction"
import Cookies from 'js-cookie';
import { createSession } from "../session/sessionAction";

const initialState: AuthState = {
    user: null,
    loading: true,
    deviceId: "",
    token: '',
    error: null,
    status: 'pending'
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.status = "pending";
            Cookies.remove("token")
            Cookies.remove("role")
        },
        resetAuthError: (state) => {
            state.error = null;
            state.status = "pending"
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.status = "pending"
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token
                state.user = action.payload.user;
                state.deviceId = action.payload.deviceId
                state.error = null;
                state.status = "succeed";
                Cookies.set("token", action.payload.access_token)
                Cookies.set("role", action.payload.user.role)
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.user = null;
                state.error = action.payload as string;
                Cookies.remove("token")
                Cookies.remove("role")
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.status = "pending"
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token
                state.user = action.payload.user;
                state.deviceId = action.payload.deviceId
                state.status = "succeed";
                state.error = null;
                Cookies.set("token", action.payload.access_token)
                Cookies.set("role", action.payload.user.role)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
                Cookies.remove("token")
                Cookies.remove("role")
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.token = ''
                state.error = null;
                state.status = "pending";
                Cookies.remove("token")
                Cookies.remove("role")
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'rejected'
                Cookies.remove("token");
                Cookies.remove("role")
                state.error = action.payload as string
            })
            .addCase(createSession.pending, (state) => {
                state.loading = true;
                state.status = "pending"
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token
                state.user = action.payload.user;
                state.deviceId = action.payload.deviceId
                state.status = "succeed";
                state.error = null;
                Cookies.set("token", action.payload.access_token)
                Cookies.set("role", action.payload.user.role)
            })
            .addCase(createSession.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
                Cookies.remove("token")
                Cookies.remove("role")
            })
    }
})

export const { resetAuth, resetAuthError } = authSlice.actions;
export default authSlice.reducer
