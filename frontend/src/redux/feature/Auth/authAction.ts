"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { SignupSchemaType } from "@/schemas/signup"
import { RootState } from "@/redux/store"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const signupUser = createAsyncThunk(
    "auth/signup",
    async (data: SignupSchemaType, { rejectWithValue }) => {
        try {
            const { confirmPassword, ...payload } = data

            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "auth/logout",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const deviceId = getState().authReducer.deviceId || "";

            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": token,
                    "deviceId":deviceId
                }
            })

            return null
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)