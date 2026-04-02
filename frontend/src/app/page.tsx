"use client"

import { useEffect, useState, useCallback } from "react";
import { Avatar, Box, Button, Card, Modal, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOtpList, getSession } from "@/redux/feature/session/sessionAction";
import { useAppDispatch } from "@/redux/hooks.ts";
import styles from "./home.module.css";
import OtpTimer from "@/component/timer-comp/timer-comp";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { insertOtp } from "@/redux/feature/session/sessionSlice";
import { enqueueSnackbar } from "notistack";

export default function Home() {
  const { user, loading, token } = useSelector((state: RootState) => state.authReducer);
  const { sessions, otps } = useSelector((state: RootState) => state.sessionReducer);
  const dispatch = useAppDispatch();
  const [OtpModalClose, setOtpModalClose] = useState<boolean>(false);

  useEffect(() => {
    const sessionOtp = async () => {
      try {
        await dispatch(getSession()).unwrap();
        await dispatch(getOtpList()).unwrap();
      }
      catch (err: any) {
        enqueueSnackbar(err, { variant: "error" })
        console.error(err);
      }
    }

    sessionOtp();
  }, [dispatch]);

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  const handleOtpModalOpen = () => setOtpModalClose(true);
  const handleOtpModalClose = () => setOtpModalClose(false);

  useEffect(() => {
    if (token) {
      const socket = connectSocket(token)

      socket.on("newOtp", (message) => {
        dispatch(insertOtp(message));
        handleOtpModalOpen();
      })

      return () => {
        disconnectSocket()
      }
    }
  }, [token, dispatch])

  return (
    <Box className={styles.container}>
      <Card className={styles.cardWrapper} elevation={3}>
        <Box className={styles.header}>
          <Avatar className={styles.avatar} />
          <Typography variant="h6" className={styles.username}>
            {user?.name || "Unknown User"}
          </Typography>
        </Box>

        <Typography variant="body2" className={styles.email}>
          Email: {user?.email || "N/A"}
        </Typography>

        <Typography variant="h6" className={styles.sessionTitle}>
          Active Sessions:
        </Typography>

        <Box className={styles.sessionsList}>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <Card key={session.uuid} className={styles.sessionCard}>
                <Typography variant="body2">Device: {session.deviceType}</Typography>
                <Typography variant="body2">IP: {session.ip}</Typography>
                <Typography variant="body2">Created At: {new Date(session.created_at).toLocaleString()}</Typography>
                <Typography variant="body2">Expires At: {new Date(session.expiresAt).toLocaleString()}</Typography>
              </Card>
            ))
          ) : (
            <Typography variant="body2">No active sessions found.</Typography>
          )}
        </Box>
      </Card>
      <Button onClick={handleOtpModalOpen}>
        Open OTPs
      </Button>

      <Modal open={OtpModalClose} onClose={handleOtpModalClose} className={styles.modal}>
        <Box className={styles.modalWrapper}>
          {otps && otps.length > 0 ? (
            otps.map((otp) => (
              <Box key={otp.uuid} sx={{ mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                {/* <Typography><strong>UUID:</strong> {otp.uuid}</Typography> */}
                <Typography><strong>OTP:</strong> {otp.otp}</Typography>
                <Typography><strong>Email:</strong> {otp.email}</Typography>
                <Typography><strong>Expires At:</strong> {new Date(otp.expiresAt).toLocaleString()}</Typography>
                {/* <Typography><strong>Created At:</strong> {new Date(otp.created_at).toLocaleString()}</Typography> */}
                {otp.deleted_at && <Typography><strong>Deleted At:</strong> {otp.deleted_at}</Typography>}
                <OtpTimer expiresAt={otp.expiresAt} />
              </Box>
            ))
          ) : (
            <Typography>No OTPs found.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}