"use client"

import { createSession, generateOtpUsigEmail } from '@/redux/feature/session/sessionAction'
import { useAppDispatch, useAppSelector } from '@/redux/hooks.ts'
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import OtpTimer from '@/component/timer-comp/timer-comp'

export default function OtpPage() {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            otp: '',
            email: ''
        }
    })
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { expiresAt } = useAppSelector((state: RootState) => state.sessionReducer);

    const handleOtpGeneration = (email: string) => {
        if (email) {
            dispatch(generateOtpUsigEmail(email)).unwrap()
                .then(() => {
                    setOtpSent(true);
                    enqueueSnackbar("OTP sent successfully", { variant: "success" });
                })
                .catch((error) => {
                    enqueueSnackbar(error || "Error generating OTP", { variant: "error" });
                    console.error('Error generating OTP:', error);
                });
        }
    };

    const onSubmit = (data: any) => {
        dispatch(createSession({ email: data.email, otp: parseInt(data.otp) }))
            .unwrap()
            .then(() => {
                enqueueSnackbar('OTP Verified & Session Created');
                router.replace('/');
            })
            .catch((error) => {
                console.error('Session creation failed:', error);
                enqueueSnackbar(error, { variant: "error" });
            });
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setValue("email", e.target.value);
        setOtpSent(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                        onChange={handleEmailChange}
                    />
                )}
            />

            <Button
                type="button"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={!email || !!errors.email}
                onClick={() => handleOtpGeneration(email)}
            >
                Send OTP
            </Button>

            {otpSent ? (
                <Controller
                    name="otp"
                    control={control}
                    rules={{
                        required: "OTP is required",
                        validate: (value) => value.length === 6 || "OTP must be 6 digits"
                    }}
                    render={({ field, fieldState }) => (
                        <Box sx={{ mt: 2 }}>
                            <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
                            {fieldState.invalid && (
                                <FormHelperText error>{fieldState?.error?.message}</FormHelperText>
                            )}
                        </Box>
                    )}
                />
            ) : (
                <FormHelperText error>OTP has not been sent yet</FormHelperText>
            )}

            {expiresAt && <OtpTimer expiresAt={expiresAt} />}

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={!otpSent}
            >
                Submit
            </Button>
        </form>
    )
}