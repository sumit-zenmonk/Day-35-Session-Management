"use client"

import { createSlice } from "@reduxjs/toolkit"
import { createSession, deleteSession, generateOtpUsigEmail, getOtpList, getSession } from "./sessionAction";

const initialState: SessionState = {
    sessions: [],
    otps: [],
    expiresAt: null,
    loading: true,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        insertOtp: (state, action) => {
            state.error = null;
            state.otps.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = Array.isArray(action.payload) ? action.payload : [action.payload];
                state.error = null;
            })
            .addCase(getSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getOtpList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOtpList.fulfilled, (state, action) => {
                state.loading = false;
                state.otps = action.payload;
                state.error = null;
            })
            .addCase(getOtpList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(generateOtpUsigEmail.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateOtpUsigEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.expiresAt = action.payload.expiresAt
            })
            .addCase(generateOtpUsigEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter(session => session.deviceId !== action.payload);
            })
    }
})

export const { insertOtp } = authSlice.actions;
export default authSlice.reducer;
