"use client"

import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const OtpTimer = ({ expiresAt }: { expiresAt: string }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const calculateTimeRemaining = useCallback(() => {
        const expiresAtTime = new Date(expiresAt).getTime();
        const currentTime = Date.now();
        return Math.max(0, Math.floor((expiresAtTime - currentTime) / 1000));
    }, [expiresAt]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateTimeRemaining]);

    return (
        <Typography variant="body2" >
            {timeRemaining > 0 ? `${timeRemaining} seconds remaining` : "Expired"
            }
        </Typography>
    );
};

export default OtpTimer;