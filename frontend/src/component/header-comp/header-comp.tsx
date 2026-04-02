"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import "./header-comp.css"
import { useState } from "react"

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const { user } = useSelector(
        (state: RootState) => state.authReducer
    )

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleLogOut = async () => {
        await dispatch(logoutUser()).unwrap()
        localStorage.clear()
        router.replace("/login")
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box className="header">
            <Box className="left-container">
                <Typography>Session Management</Typography>
            </Box>

            <Box className="right-container">
                {user ? (
                    <Box>
                        <Button
                            onClick={() => {
                                router.push("/")
                                handleMenuClose()
                            }}
                        >
                            Home
                        </Button>
                        <Button
                            sx={{ color: "red" }}
                            onClick={async () => {
                                await handleLogOut()
                                handleMenuClose()
                            }}
                        >
                            Log Out
                        </Button>
                    </Box>
                ) : (
                    <Button
                        onClick={() => {
                            router.push("/login")
                            handleMenuClose()
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </Box>
    )
}