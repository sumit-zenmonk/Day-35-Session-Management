"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "@/redux/store"
import { loginUser } from "../Auth/authAction"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const getSession = createAsyncThunk<
    SessionType,
    void,
    { state: RootState }
>(
    "auth/getSession",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const deviceId = getState().authReducer.deviceId || "";

            const res = await fetch(`${API_URL}/session`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "deviceId": deviceId
                },
                credentials: "include",
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.message)

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const getOtpList = createAsyncThunk<
    OtpType[],
    void,
    { state: RootState }
>(
    "auth/getOtpList",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const deviceId = getState().authReducer.deviceId || "";

            const res = await fetch(`${API_URL}/session/otp`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "deviceId": deviceId
                },
                credentials: "include",
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateOtpUsigEmail = createAsyncThunk(
    "session/generateOtp",
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/session/otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createSession = createAsyncThunk(
    "session/createSession",
    async (
        { email, otp }: { email: string; otp: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(`${API_URL}/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);