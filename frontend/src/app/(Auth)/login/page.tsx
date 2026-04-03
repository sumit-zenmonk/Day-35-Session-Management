"use client"

import styles from "./login.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchemaType } from "@/schemas/login"
import { useRouter } from "next/navigation"
import GoogleIcon from '@mui/icons-material/Google';

import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    Divider,
    Modal
} from "@mui/material"
import { loginUser } from "@/redux/feature/Auth/authAction"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import OtpComp from "@/component/otp-comp/otp-comp"

export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const [OtpModalClose, setOtpModalClose] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            router.replace("/")
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" })
            console.log(error)
            if (error = 'Too many devices logged in') {
                handleOtpModalOpen();
            }
        }
    }

    const handleOtpModalOpen = () => setOtpModalClose(true);
    const handleOtpModalClose = () => setOtpModalClose(false);

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={3}>
                <Typography variant="h5" className={styles.title}>
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            {...register("password")}
                        />
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        type="submit"
                        className={styles.button}
                    >
                        Login
                    </Button>
                </form>

                <Button
                    variant="text"
                    className={styles.button}
                    onClick={() => router.replace("/signup")}
                >
                    Create New Account?
                </Button>
            </Card>

            <Modal open={OtpModalClose} onClose={handleOtpModalClose} className={styles.modal}>
                <Box className={styles.modalWrapper}>
                    <OtpComp />
                </Box>
            </Modal>
        </Box>
    )
}